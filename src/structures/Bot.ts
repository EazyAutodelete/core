import { BotConfig } from "../";
import Command from "./Command";
import CommandResponseHandler from "./discord/CommandResponseHandler";
import Discord, { ColorResolvable, TextChannel } from "discord.js";
import Logger from "./Logger";
import Timers from "timers";
import util from "util";
import { ChannelSettings, DatabaseHandler } from "@eazyautodelete/eazyautodelete-db-client";
import Translator, { Locale, locales } from "@eazyautodelete/eazyautodelete-lang";
import { APIMessage } from "discord-api-types/v10";
import WebHook from "./WebHook";
import { readdirSync, readFileSync } from "fs";
import { lstat, readdir } from "fs/promises";
import { parse } from "json5";
import path from "path";
import Event from "./Event";

type AssetType = "urls" | "emojis" | "images" | "colors";
type AssetValue =
  | string
  | Record<
      string,
      string | Record<string, string | Record<string, string | Record<string, string>>>
    >;

class Bot extends Discord.Client {
  activeEvents: string[];
  allShardsReady: boolean;
  commands: Discord.Collection<string, Command>;
  config: BotConfig;
  cooldown: Map<string, number>;
  database: DatabaseHandler;
  disabledCommands: Map<string, string>;
  Logger: Logger;
  ready: boolean;
  response: CommandResponseHandler;
  Translator: Translator;

  wait: <T = void>(
    delay?: number | undefined,
    value?: T | undefined,
    options?: Timers.TimerOptions | undefined
  ) => Promise<T>;

  private _assets: Record<AssetType, AssetValue>;
  urls: Record<string, AssetValue>;
  customEmojis: Record<string, AssetValue>;
  images: Record<string, AssetValue>;
  colors: Record<string, Discord.ColorResolvable>;
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
    IDS: {
      PINNED: number;
      NOT_PINNED: number;
      REGEX: number;
      NOT_REGEX: number;
      ALL: number;
      WITH_LINK: number;
      WITHOUT_LINK: number;
      WITH_EMOJIS: number;
      WITHOUT_EMOJIS: number;
      WITH_ATTACHMENT: number;
      WITHOUT_ATTACHMENT: number;
    };
  };
  activeChannels: { config: ChannelSettings, channel: TextChannel }[];

  constructor(config: BotConfig) {
    super({
      intents: [
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
      ],
      partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    });

    // config
    this.config = config || new Error("no config");

    // wait
    this.wait = util.promisify(setTimeout);

    // shards
    this.allShardsReady = false;

    // logging
    this.Logger = new Logger();

    // response
    this.response = new CommandResponseHandler(this);

    // translator
    this.Translator = new Translator({ defaultLocale: "en", locales: locales });

    // cooldown
    this.cooldown = new Discord.Collection();

    // commands
    this.commands = new Discord.Collection();
    this.disabledCommands = new Map();

    // ready
    this.ready = false;

    // database
    this.database = new DatabaseHandler(
      { mongo: config.mongo, redis: config.redis },
      this.Logger
    );

    // Filter Flags
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
      IDS: {
        PINNED: 7,
        NOT_PINNED: 8,
        REGEX: 9,
        NOT_REGEX: 10,
        ALL: 0,
        WITH_LINK: 3,
        WITHOUT_LINK: 4,
        WITH_EMOJIS: 1,
        WITHOUT_EMOJIS: 2,
        WITH_ATTACHMENT: 5,
        WITHOUT_ATTACHMENT: 6,
      },
    };

    // assets
    this._assets = {
      emojis: {},
      images: {},
      urls: {},
      colors: {},
    };
    this.loadAssets();

    this.urls = this._assets.urls as Record<string, AssetValue>;
    this.images = this._assets.images as Record<string, AssetValue>;
    this.customEmojis = this._assets.emojis as Record<string, AssetValue>;
    this.colors = this._assets.colors as Record<string, ColorResolvable>;

    // active events
    this.activeEvents = [];

    // active channels
    this.activeChannels = [];
  }

  private loadAssets(): void {
    for (const file of readdirSync(
      path.join(require.main?.path || "", "..", "config/assets")
    )) {
      this._assets[file.replace(".json5", "") as AssetType] = parse(
        readFileSync(path.join(require.main?.path || "", "..", "config/assets", file), {
          encoding: "utf-8",
        })
      );
    }
  }

  public translate(data: { phrase: string; locale: Locale }, ...args: string[]): string {
    return this.Translator.translate(data.phrase, data.locale, ...args) as string;
  }

  public filterMessages(
    messages: Discord.Message[],
    filters: number[],
    filterUsage: string,
    regex: RegExp
  ): Discord.Collection<string, Discord.Message | APIMessage> {
    const emojiRegex = /<a?:(\w+):(\d+)>/gm;
    const urlRegex = new RegExp(
      /(((http|https):\/\/)|www\.)[a-zA-Z0-9\-.]+.[a-zA-Z]{2,6}/
    );
    const filteredMessages: Discord.Collection<string, Discord.Message | APIMessage> =
      new Discord.Collection();

    if (filterUsage === this.filters.FLAGS.USAGE_ALL) {
      messages.forEach((message): void => {
        let i = 0;
        filters.forEach(filter => {
          if (filter === this.filters.IDS.PINNED && message.pinned) i++;
          if (filter === this.filters.IDS.NOT_PINNED && !message.pinned) i++;
          if (filter === this.filters.IDS.REGEX && regex && regex?.test(message.content))
            i++;
          if (
            filter === this.filters.IDS.NOT_REGEX &&
            regex &&
            !regex?.test(message.content)
          )
            i++;
          if (
            filter === this.filters.IDS.WITH_ATTACHMENT &&
            message?.attachments?.keys.length >= 0
          )
            i++;
          if (filter === this.filters.IDS.WITHOUT_ATTACHMENT && !message.attachments) i++;
          if (
            filter === this.filters.IDS.WITHOUT_EMOJIS &&
            !emojiRegex.test(message.content)
          )
            i++;
          if (filter === this.filters.IDS.WITH_EMOJIS && emojiRegex.test(message.content))
            i++;
          if (
            filter === this.filters.IDS.WITHOUT_EMOJIS &&
            !emojiRegex.test(message.content)
          )
            i++;
          if (filter === this.filters.IDS.WITH_LINK && urlRegex.test(message.content))
            i++;
          if (filter === this.filters.IDS.WITHOUT_LINK && !urlRegex.test(message.content))
            i++;
        });
        if (i === filters.length) filteredMessages.set(message.id, message);
        return;
      });
    } else if (filterUsage === this.filters.FLAGS.USAGE_ONE) {
      messages.forEach((message): void => {
        let i = 0;
        filters.forEach(filter => {
          if (filter === this.filters.IDS.PINNED && message.pinned) i++;
          if (filter === this.filters.IDS.NOT_PINNED && !message.pinned) i++;
          if (filter === this.filters.IDS.REGEX && regex && regex?.test(message.content))
            i++;
          if (
            filter === this.filters.IDS.NOT_REGEX &&
            regex &&
            !regex?.test(message.content)
          )
            i++;
          if (
            filter === this.filters.IDS.WITH_ATTACHMENT &&
            message?.attachments?.keys.length >= 0
          )
            i++;
          if (
            filter === this.filters.IDS.WITHOUT_ATTACHMENT &&
            (!message.attachments || message?.attachments?.keys.length === 0)
          )
            i++;
          if (
            filter === this.filters.IDS.WITHOUT_EMOJIS &&
            !emojiRegex.test(message.content)
          )
            i++;
          if (filter === this.filters.IDS.WITH_EMOJIS && emojiRegex.test(message.content))
            i++;
          if (
            filter === this.filters.IDS.WITHOUT_EMOJIS &&
            !emojiRegex.test(message.content)
          )
            i++;
          if (filter === this.filters.IDS.WITH_LINK && urlRegex.test(message.content))
            i++;
          if (filter === this.filters.IDS.WITHOUT_LINK && !urlRegex.test(message.content))
            i++;
        });
        if (i !== 0) filteredMessages.set(message.id, message);
        return;
      });
    }
    return filteredMessages;
  }

  public async bulkDelete(
    channel: string,
    messages: Discord.Collection<string, Discord.Message>
  ): Promise<void | string[]> {
    if (!channel || typeof channel != "string") return [];
    if (messages instanceof Discord.Collection) {
      let messageIds =
        messages instanceof Discord.Collection
          ? [...messages.keys()]
          : messages.map((x: Discord.Message) => x?.id || x);
      messageIds = messageIds.filter(
        (id: string) =>
          Date.now() - Discord.SnowflakeUtil.deconstruct(id).timestamp < 1_209_600_000
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

  public async clientValue(value: string): Promise<string | void> {
    const results = await this.shard?.fetchClientValues(value).catch(this.Logger.error);
    if (!Array.isArray(results)) return;
    const r: string[] = [];
    results.forEach(v => r.push(`${v}`));
    return r ? r.reduce((prev: string, val: string) => prev + val) : undefined;
  }

  public sendWebhook(url: string, message: string): void {
    if (!url || !message) return;

    new WebHook(url).setContent(message).send();
  }

  public async registerEvents(client: Bot, dir = ""): Promise<void> {
    const files = await readdir(require.main?.path + dir);
    for (const file of files) {
      const stat = await lstat(require.main?.path + `${dir}/${file}`);
      if (stat.isDirectory()) this.registerEvents(client, `${dir}/${file}`);
      if (file.endsWith(".js")) {
        const event = require(require.main?.path + `/${dir}/${file}`).default;
        if (event) {
          if (event.prototype instanceof Event) {
            const evnt = new event(client);
            client.on(evnt.name, evnt.run.bind(evnt, client));
            client.activeEvents.push(evnt.name);
          }
        }
      }
    }
  }

  public async registerCommands(client: Bot, dir = ""): Promise<void> {
    const files = await readdir(require.main?.path + dir);

    for (const file of files) {
      const stat = await lstat(require.main?.path + `${dir}/${file}`);

      if (stat.isDirectory()) client.registerCommands(client, `${dir}/${file}`);

      if (file.endsWith(".js")) {
        const command = require(require.main?.path + `/${dir}/${file}`).default;

        if (command) {
          if (command.prototype instanceof Command) {
            const cmd = new command(client);
            client.commands.set(cmd.help.name, cmd);
          }
        }
      }
    }
  }
}

export default Bot;
