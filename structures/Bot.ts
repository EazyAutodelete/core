import { APIGuild, APIMessage, APIUser } from "discord-api-types/v10";
import {
  Collection,
  Guild,
  Message,
  Client,
  Intents,
  SnowflakeUtil,
  GuildMember,
  Serialized,
  ShardClientUtil,
} from "discord.js";
import util from "util";
import WebHook from "../utils/WebHook";
import DatabaseHandler from "@eazyautodelete/eazyautodelete-db-client";
import Command from "./Command";
import fs from "fs/promises";
import { BotConfig } from "../typings/index";
import { writeFileSync, readFileSync } from "fs";
import axios from "axios";
import constants from "../constants/constants";
import {
  translate,
  Translator,
  locales,
} from "@eazyautodelete/eazyautodelete-lang";
import Logger from "../utils/Logger";
import colors from "../constants/assets/colors/colors";
import assets from "../constants/assets/assets";
import emojis from "../constants/emojis/emojis";

export default class Bot extends Client {
  config: BotConfig;
  wait: <T = void>(
    delay?: number | undefined,
    value?: T | undefined,
    options?: import("timers").TimerOptions | undefined
  ) => Promise<T>;
  allShardsReady: boolean;
  customEmojis: typeof emojis;
  startedAt: Date;
  startedAtString: string;
  activeEvents: string[];
  eventLog: string;
  shard!: ShardClientUtil | null;
  stats: { commandsRan: number };
  locales: locales;
  Translator: Translator;
  translate: translate;
  cooldownUsers: Collection<string, number>;
  commands: Collection<string, Command>;
  disabledCommands: Map<string, string>;
  ready: boolean;
  Logger: Logger;
  logger: Logger;
  loggedActions: {
    messages: Map<string, Message>;
    commands: Map<string, number>;
  };
  database: DatabaseHandler;
  activeChannels: string[];
  checkedChannels: string[];
  filters: {
    FLAGS: {
      PINNED: string;
      NOT_PINNED: string;
      REGEX: string;
      NOT_REGEX: string;
      ALL: string;
      WITH_LINK: string;
      WITHOUT_LINK: string;
      WITH_EMOJIS: string;
      WITHOUT_EMOJIS: string;
      WITH_ATTACHMENT: string;
      WITHOUT_ATTACHMENT: string;
      USAGE_ALL: string;
      USAGE_ONE: string;
    };
  };
  eventLogPath: string;
  assets: typeof assets;
  colors: typeof colors;
  constructor(config: BotConfig) {
    super({
      intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS,
      ],
      partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    });
    // config
    this.config = config || {};

    //
    this.wait = util.promisify(setTimeout);

    // shards
    this.allShardsReady = false;

    // assets
    this.assets = constants.assets;
    this.colors = constants.assets.colors;
    this.customEmojis = constants.emojis;

    // event logging
    this.startedAt = new Date();
    this.startedAtString = `${this.startedAt.getFullYear()}-${
      this.startedAt.getMonth() - 1
    }-${this.startedAt.getDate()} ${this.startedAt.getHours()}-${this.startedAt.getMinutes()}-${this.startedAt.getSeconds()}`;
    this.eventLog = ``;
    this.activeEvents = [];

    this.eventLogPath = "./logs/shards/events";

    setInterval(() => {
      if (this.eventLog === ``) return;

      const data = readFileSync(this.eventLogPath, { encoding: "utf-8" });

      writeFileSync(this.eventLogPath, `${data}${this.eventLog}`);

      this.eventLog = ``;
    }, 1000);

    // stats
    this.stats = {
      commandsRan: 0,
    };

    // language
    this.locales = locales;
    this.Translator = Translator;
    this.translate = translate;
    // this.translate({ phrase: "", locale: "" })

    // cooldown
    this.cooldownUsers = new Collection();

    // commands
    this.commands = new Collection();
    this.disabledCommands = new Map();

    // ready
    this.ready = false;

    // logging
    this.Logger = new Logger();
    this.logger = this.Logger;
    this.loggedActions = {
      messages: new Map(),
      commands: new Map(),
    };

    // database
    this.database = new DatabaseHandler(
      { redis: this.config?.redis, mongo: this.config?.mongo },
      this.Logger
    );

    this.activeChannels = [];
    this.checkedChannels = [];

    // filters
    this.filters = {
      FLAGS: {
        PINNED: "pinned",
        NOT_PINNED: "not_pinned",
        REGEX: "regex",
        NOT_REGEX: "not_regex",
        ALL: "all",
        WITH_LINK: "with_link",
        WITHOUT_LINK: "without_link",
        WITH_EMOJIS: "with_emojis",
        WITHOUT_EMOJIS: "without_emojis",
        WITH_ATTACHMENT: "with_attachment",
        WITHOUT_ATTACHMENT: "without_attachment",
        USAGE_ALL: "all",
        USAGE_ONE: "one",
      },
    };
  }

  logEvent(eventName: string): void {
    const d = new Date();
    const date = `[${d.getDate()}/${
      d.toDateString().split(" ")[1]
    }/${d.getFullYear()}:${
      1 === d.getHours().toString().length ? `0${d.getHours()}` : d.getHours()
    }:${
      1 === d.getMinutes().toString().length
        ? `0${d.getMinutes()}`
        : d.getMinutes()
    }:${
      1 === d.getSeconds().toString().length
        ? `0${d.getSeconds()}`
        : d.getSeconds()
    } +1200]`;
    this.eventLog = `${this.eventLog}
Shard-${this.shard?.ids} - - ${date} "GET /${eventName} HTTP/1.1" 200 1 "-" "Bot" "-"`;
  }

  filterMessages(
    messages: Message[] | APIMessage[],
    filters: string[],
    filterUsage: string,
    regex: RegExp
  ): Collection<string, Message | APIMessage> {
    const emojiRegex = /<a?:(\w+):(\d+)>/gm;
    const urlRegex = new RegExp(
      /(((http|https):\/\/)|www\.)[a-zA-Z0-9\-.]+.[a-zA-Z]{2,6}/
    );
    const filteredMessages: Collection<string, Message | APIMessage> =
      new Collection();

    if (filterUsage === this.filters.FLAGS.USAGE_ALL) {
      messages.forEach((message): void => {
        let i = 0;
        filters.forEach((filter) => {
          if (filter === this.filters.FLAGS.PINNED && message.pinned) i++;
          if (filter === this.filters.FLAGS.NOT_PINNED && !message.pinned) i++;
          if (
            filter === this.filters.FLAGS.REGEX &&
            regex &&
            regex?.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.NOT_REGEX &&
            regex &&
            !regex?.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITH_ATTACHMENT &&
            message?.attachments?.keys.length >= 0
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITHOUT_ATTACHMENT &&
            !message.attachments
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITHOUT_EMOJIS &&
            !emojiRegex.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITH_EMOJIS &&
            emojiRegex.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITHOUT_EMOJIS &&
            !emojiRegex.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITH_LINK &&
            urlRegex.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITHOUT_LINK &&
            !urlRegex.test(message.content)
          )
            i++;
        });
        if (i === filters.length) filteredMessages.set(message.id, message);
        return;
      });
    } else if (filterUsage === this.filters.FLAGS.USAGE_ONE) {
      messages.forEach((message): void => {
        let i = 0;
        filters.forEach((filter) => {
          if (filter === this.filters.FLAGS.PINNED && message.pinned) i++;
          if (filter === this.filters.FLAGS.NOT_PINNED && !message.pinned) i++;
          if (
            filter === this.filters.FLAGS.REGEX &&
            regex &&
            regex?.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.NOT_REGEX &&
            regex &&
            !regex?.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITH_ATTACHMENT &&
            message?.attachments?.keys.length >= 0
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITHOUT_ATTACHMENT &&
            (!message.attachments || message?.attachments?.keys.length === 0)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITHOUT_EMOJIS &&
            !emojiRegex.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITH_EMOJIS &&
            emojiRegex.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITHOUT_EMOJIS &&
            !emojiRegex.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITH_LINK &&
            urlRegex.test(message.content)
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITHOUT_LINK &&
            !urlRegex.test(message.content)
          )
            i++;
        });
        if (i !== 0) filteredMessages.set(message.id, message);
        return;
      });
    }
    return filteredMessages;
  }

  logAction(action: string, duration: number): boolean {
    if (
      !action ||
      typeof action != "string" ||
      !duration ||
      typeof duration != "number"
    )
      return false;

    new WebHook(this.assets?.url?.logs?.actions)
      .setContent(`**Action:**\n> ${action}\n\n**Duration:**\n> ${duration}ms`)
      .send();

    return true;
  }

  modeToString(mode: number): string {
    switch (mode) {
      case 0:
        return `Deactivated`;

      case 1:
        return `Wait 30s and then delete the message`;

      case 2:
        return `Delete all messages every 5m`;

      case 3:
        return `Wait 5 messages and then delete all messages`;

      case 4:
        return `Keep the newest 5 messages and delete`;

      default:
        return `An error occured [Core.Bot.modeToString.default]`;
    }
  }

  filterToString(filter: number): string {
    switch (filter) {
      case 0:
        return `all`;

      case 1:
        return `with Emojis`;

      case 2:
        return `without Emojis`;

      case 3:
        return `with Links`;

      case 4:
        return `without Links`;

      case 5:
        return `with Attachment`;

      case 6:
        return `without Attachment`;

      case 7:
        return `pinned`;

      case 8:
        return `not pinned`;

      case 9:
        return `Regex`;

      case 10:
        return `not regex`;

      default:
        return "An error occured [Core.Bot.filterToString.default]";
    }
  }

  filterUsageToString(filterUsage: string): string {
    switch (filterUsage) {
      case "all":
        return `Meet all specified filters`;

      case "one":
        return `Meet one of the specified filters`;

      default:
        return `An error occured [Invalid Filter: Core.Bot.filterUsageToString.default]`;
    }
  }

  async bulkDelete(
    channel: string,
    messages: Collection<string, Message | APIMessage>
  ): Promise<void | string[]> {
    if (!channel || typeof channel != "string") return [];
    if (messages instanceof Collection) {
      let messageIds =
        messages instanceof Collection
          ? [...messages.keys()]
          : messages.map((x: Message) => x?.id || x);
      messageIds = messageIds.filter(
        (id: string) =>
          Date.now() - SnowflakeUtil.deconstruct(id).timestamp < 1_209_600_000
      );
      if (messageIds.length === 0) return [];
      if (messageIds.length === 1) {
        await this.api.channels[channel]
          .messages(messageIds[0])
          .delete()
          .catch((error: string) => {
            this.Logger.error(error);
            return [];
          });
        return messageIds;
      }
      await this.api.channels[channel].messages["bulk-delete"]
        .post({ data: { messages: messageIds } })
        .catch((error: string) => {
          this.Logger.error(error);
          return [];
        });
      return messageIds;
    }
  }

  createDeleteLog(
    channelId: string,
    messages: Collection<string, Message>
  ): void {
    if (!channelId || typeof channelId != "string") return;
    if (Array.isArray(messages) || messages instanceof Collection) {
      const messageIds =
        messages instanceof Collection
          ? [...messages.keys()]
          : messages.map((x: Message) => x?.id || x);
      new WebHook(this.assets?.url?.messageWebhook)
        .setContent(
          `Deleted **${messageIds.length} messages** in \`#${channelId}\`.\n\n\`\`\`js\n${messageIds}\`\`\``
        )
        .send();
    }
  }

  parseDuration(duration: number): string {
    const years = Math.floor(
        (duration / (1000 * 60 * 60 * 24 * 7 * 365)) % 999
      ),
      weeks = Math.floor((duration / (1000 * 60 * 60 * 24 * 7)) % 51),
      days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 7),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      seconds = Math.floor((duration / 1000) % 60),
      uptime = [
        years === 1 ? years + " " + "year" : years + " " + "years",
        weeks === 1 ? weeks + " " + "week" : weeks + " " + "weeks",
        days === 1 ? days + " " + "day" : days + " " + "days",
        hours === 1 ? hours + " " + "hour" : hours + " " + "hours",
        minutes === 1 ? minutes + " " + "minute" : minutes + " " + "minutes",
        seconds === 1 ? seconds + " " + "second" : seconds + " " + "seconds",
      ]
        .filter((time) => !time.startsWith("0"))
        .join(", ");

    return uptime;
  }

  parseDate(timestamp: number): string {
    const date = new Date(timestamp);

    const day =
      date.getDate().toString().length === 1
        ? "0" + date.getDate().toString()
        : date.getDate().toString();
    const month =
      (date.getMonth() + 1).toString().length === 1
        ? "0" + (date.getMonth() + 1).toString()
        : (date.getMonth() + 1).toString();

    const hours =
      date.getHours().toString().length === 1
        ? "0" + date.getHours().toString()
        : date.getHours().toString();
    const minutes =
      date.getMinutes().toString().length === 1
        ? "0" + date.getMinutes().toString()
        : date.getMinutes().toString();
    const seconds =
      date.getSeconds().toString().length === 1
        ? "0" + date.getSeconds().toString()
        : date.getSeconds().toString();

    return (
      date.getFullYear() +
      "." +
      month +
      "." +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds +
      ""
    );
  }

  async clientValue(value: string): Promise<string | void> {
    const results = await this.shard
      ?.fetchClientValues(value)
      .catch(this.Logger.error);
    if (!Array.isArray(results)) return;
    const r: string[] = [];
    results.forEach((v) => r.push(`${v}`));
    return r ? r.reduce((prev: string, val: string) => prev + val) : undefined;
  }

  sendShardWebhook(message: string): void {
    if (!this.assets?.url?.statusWebhook || !message) return;

    new WebHook(this.assets.url.statusWebhook).setContent(message).send();
  }

  sendGuildWebhook(message: string): void {
    if (!this.assets?.url?.logs?.guilds || !message) return;

    new WebHook(this.assets.url.logs.guilds).setContent(message).send();
  }

  async shardEval(
    input: <T>(client: Client<boolean>) => Promise<Serialized<T>[]>
  ): Promise<void | Record<string, unknown>[][] | undefined> {
    const results = await this.shard
      ?.broadcastEval(input)
      .catch(this.Logger.error);
    return results;
  }

  async resolveMember(
    search: string,
    guild: Guild
  ): Promise<GuildMember | void> {
    let member;
    if (!search || typeof search !== "string") return;
    // Try ID search
    if (search.match(/^<@!?(\d+)>$/)) {
      const id = search.match(/^<@!?(\d+)>$/)?.[1];
      if (!id) return;
      member = await guild.members.fetch(id).catch(this.logger.error);
      if (member) return member;
    }
    // Try username search
    if (search.match(/^!?([^#]+)#(\d+)$/)) {
      await guild.members.fetch();
      member = guild.members.cache.find(
        (m: GuildMember) => m.user.tag === search
      );
      if (member) return member;
    }
    member = await guild.members.fetch(search).catch(this.logger.error);
    return member;
  }

  async getApiGuild(id: string): Promise<APIGuild> {
    const headers = {
      Authorization: `Bot ${this.config.token}`,
    };

    const apiResult = await axios.get(`http://discord.com/api/guilds/${id}`, {
      headers: headers,
    });

    const data = JSON.parse(apiResult.data);

    return data;
  }

  async getApiUser(id: string): Promise<APIUser | void> {
    const headers = {
      Authorization: `Bot ${this.config.token}`,
    };

    const apiResult = await axios.get(`http://discord.com/api/users/${id}`, {
      headers: headers,
    });

    const data = apiResult.data;

    if (!data) return;
    if (!data.id) return;

    const user = {
      id: data.id,
      discriminator: data.discriminator,
      tag: data.username + "#" + data.discriminator,
      avatar: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`,
      username: data.username,
      bot: data.bot,
      banner: `https://cdn.discordapp.com/banners/${data.id}/${data.banner}.png`,
    };
    return user;
  }

  async registerEvents(dir = ""): Promise<void> {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const stat = await fs.lstat(`${dir}/${file}`);
      if (stat.isDirectory()) this.registerEvents(`${dir}/${file}`);
      if (file.endsWith(".js")) {
        const event = require(`${dir}/${file}`);
        if (event.prototype instanceof Event) {
          const evnt = new event(this);
          this.on(evnt.name, evnt.run.bind(evnt, this));
          this.activeEvents.push(evnt.name);
        }
      }
    }
  }

  async registerCommands(dir = ""): Promise<void> {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const stat = await fs.lstat(`${dir}/${file}`);
      if (stat.isDirectory()) this.registerCommands(`${dir}/${file}`);
      if (file.endsWith(".js")) {
        const command = require(`${dir}/${file}`);
        if (command.prototype instanceof Command) {
          const cmd = new command(this);
          this.commands.set(cmd.help.name, cmd);
        }
      }
    }
  }
}
