"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const util_1 = __importDefault(require("util"));
const WebHook_1 = __importDefault(require("../utils/WebHook"));
const Command_1 = __importDefault(require("./Command"));
const promises_1 = __importDefault(require("fs/promises"));
const axios_1 = __importDefault(require("axios"));
const constants_1 = __importDefault(require("../constants/constants"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const Event_1 = __importDefault(require("./Event"));
class Bot extends discord_js_1.Client {
  constructor(config, Database, Translator) {
    super({
      intents: [
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_BANS,
        discord_js_1.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        discord_js_1.Intents.FLAGS.GUILD_INTEGRATIONS,
        discord_js_1.Intents.FLAGS.GUILD_INVITES,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
        discord_js_1.Intents.FLAGS.GUILD_WEBHOOKS,
      ],
      partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    });
    // config
    this.config = config || {};
    //
    this.wait = util_1.default.promisify(setTimeout);
    // shards
    this.allShardsReady = false;
    // assets
    this.assets = constants_1.default.assets;
    this.colors = constants_1.default.assets.colors;
    this.customEmojis = constants_1.default.emojis;
    // event logging
    this.startedAt = new Date();
    this.startedAtString = `${this.startedAt.getFullYear()}-${
      this.startedAt.getMonth() - 1
    }-${this.startedAt.getDate()} ${this.startedAt.getHours()}-${this.startedAt.getMinutes()}-${this.startedAt.getSeconds()}`;
    this.eventLog = ``;
    this.activeEvents = [];
    this.eventLogPath = "logs/shards/events";
    setInterval(() => {
      if (this.eventLog === ``) return;
      // TODO: POST STATS
    }, 1000);
    // stats
    this.stats = {
      commandsRan: 0,
    };
    // language
    this.locales = Translator.getLocales();
    this.Translator = Translator;
    this.translate = Translator.__;
    // cooldown
    this.cooldownUsers = new discord_js_1.Collection();
    // commands
    this.commands = new discord_js_1.Collection();
    this.disabledCommands = new Map();
    // ready
    this.ready = false;
    // logging
    this.Logger = new Logger_1.default();
    this.logger = this.Logger;
    this.loggedActions = {
      messages: new Map(),
      commands: new Map(),
    };
    // database
    this.database = Database;
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
  logEvent(eventName) {
    var _a;
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
Shard-${
      (_a = this.shard) === null || _a === void 0 ? void 0 : _a.ids
    } - - ${date} "GET /${eventName} HTTP/1.1" 200 1 "-" "Bot" "-"`;
  }
  filterMessages(messages, filters, filterUsage, regex) {
    const emojiRegex = /<a?:(\w+):(\d+)>/gm;
    const urlRegex = new RegExp(
      /(((http|https):\/\/)|www\.)[a-zA-Z0-9\-.]+.[a-zA-Z]{2,6}/
    );
    const filteredMessages = new discord_js_1.Collection();
    if (filterUsage === this.filters.FLAGS.USAGE_ALL) {
      messages.forEach((message) => {
        let i = 0;
        filters.forEach((filter) => {
          var _a;
          if (filter === this.filters.FLAGS.PINNED && message.pinned) i++;
          if (filter === this.filters.FLAGS.NOT_PINNED && !message.pinned) i++;
          if (
            filter === this.filters.FLAGS.REGEX &&
            regex &&
            (regex === null || regex === void 0
              ? void 0
              : regex.test(message.content))
          )
            i++;
          if (
            filter === this.filters.FLAGS.NOT_REGEX &&
            regex &&
            !(regex === null || regex === void 0
              ? void 0
              : regex.test(message.content))
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITH_ATTACHMENT &&
            ((_a =
              message === null || message === void 0
                ? void 0
                : message.attachments) === null || _a === void 0
              ? void 0
              : _a.keys.length) >= 0
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
      messages.forEach((message) => {
        let i = 0;
        filters.forEach((filter) => {
          var _a, _b;
          if (filter === this.filters.FLAGS.PINNED && message.pinned) i++;
          if (filter === this.filters.FLAGS.NOT_PINNED && !message.pinned) i++;
          if (
            filter === this.filters.FLAGS.REGEX &&
            regex &&
            (regex === null || regex === void 0
              ? void 0
              : regex.test(message.content))
          )
            i++;
          if (
            filter === this.filters.FLAGS.NOT_REGEX &&
            regex &&
            !(regex === null || regex === void 0
              ? void 0
              : regex.test(message.content))
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITH_ATTACHMENT &&
            ((_a =
              message === null || message === void 0
                ? void 0
                : message.attachments) === null || _a === void 0
              ? void 0
              : _a.keys.length) >= 0
          )
            i++;
          if (
            filter === this.filters.FLAGS.WITHOUT_ATTACHMENT &&
            (!message.attachments ||
              ((_b =
                message === null || message === void 0
                  ? void 0
                  : message.attachments) === null || _b === void 0
                ? void 0
                : _b.keys.length) === 0)
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
  logAction(action, duration) {
    var _a, _b, _c;
    if (
      !action ||
      typeof action != "string" ||
      !duration ||
      typeof duration != "number"
    )
      return false;
    new WebHook_1.default(
      (_c =
        (_b =
          (_a = this.assets) === null || _a === void 0 ? void 0 : _a.url) ===
          null || _b === void 0
          ? void 0
          : _b.logs) === null || _c === void 0
        ? void 0
        : _c.actions
    )
      .setContent(`**Action:**\n> ${action}\n\n**Duration:**\n> ${duration}ms`)
      .send();
    return true;
  }
  modeToString(mode) {
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
  filterToString(filter) {
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
  filterUsageToString(filterUsage) {
    switch (filterUsage) {
      case "all":
        return `Meet all specified filters`;
      case "one":
        return `Meet one of the specified filters`;
      default:
        return `An error occured [Invalid Filter: Core.Bot.filterUsageToString.default]`;
    }
  }
  bulkDelete(channel, messages) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!channel || typeof channel != "string") return [];
      if (messages instanceof discord_js_1.Collection) {
        let messageIds =
          messages instanceof discord_js_1.Collection
            ? [...messages.keys()]
            : messages.map(
                (x) => (x === null || x === void 0 ? void 0 : x.id) || x
              );
        messageIds = messageIds.filter(
          (id) =>
            Date.now() - discord_js_1.SnowflakeUtil.deconstruct(id).timestamp <
            1209600000
        );
        if (messageIds.length === 0) return [];
        if (messageIds.length === 1) {
          yield this.api.channels[channel]
            .messages(messageIds[0])
            .delete()
            .catch((error) => {
              this.Logger.error(error);
              return [];
            });
          return messageIds;
        }
        yield this.api.channels[channel].messages["bulk-delete"]
          .post({ data: { messages: messageIds } })
          .catch((error) => {
            this.Logger.error(error);
            return [];
          });
        return messageIds;
      }
    });
  }
  createDeleteLog(channelId, messages) {
    var _a, _b;
    if (!channelId || typeof channelId != "string") return;
    if (
      Array.isArray(messages) ||
      messages instanceof discord_js_1.Collection
    ) {
      const messageIds =
        messages instanceof discord_js_1.Collection
          ? [...messages.keys()]
          : messages.map(
              (x) => (x === null || x === void 0 ? void 0 : x.id) || x
            );
      new WebHook_1.default(
        (_b =
          (_a = this.assets) === null || _a === void 0 ? void 0 : _a.url) ===
          null || _b === void 0
          ? void 0
          : _b.messageWebhook
      )
        .setContent(
          `Deleted **${messageIds.length} messages** in \`#${channelId}\`.\n\n\`\`\`js\n${messageIds}\`\`\``
        )
        .send();
    }
  }
  parseDuration(duration) {
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
  parseDate(timestamp) {
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
  clientValue(value) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const results = yield (_a = this.shard) === null || _a === void 0
        ? void 0
        : _a.fetchClientValues(value).catch(this.Logger.error);
      if (!Array.isArray(results)) return;
      const r = [];
      results.forEach((v) => r.push(`${v}`));
      return r ? r.reduce((prev, val) => prev + val) : undefined;
    });
  }
  sendShardWebhook(message) {
    var _a, _b;
    if (
      !((_b =
        (_a = this.assets) === null || _a === void 0 ? void 0 : _a.url) ===
        null || _b === void 0
        ? void 0
        : _b.statusWebhook) ||
      !message
    )
      return;
    new WebHook_1.default(this.assets.url.statusWebhook)
      .setContent(message)
      .send();
  }
  sendGuildWebhook(message) {
    var _a, _b, _c;
    if (
      !((_c =
        (_b =
          (_a = this.assets) === null || _a === void 0 ? void 0 : _a.url) ===
          null || _b === void 0
          ? void 0
          : _b.logs) === null || _c === void 0
        ? void 0
        : _c.guilds) ||
      !message
    )
      return;
    new WebHook_1.default(this.assets.url.logs.guilds)
      .setContent(message)
      .send();
  }
  shardEval(input) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const results = yield (_a = this.shard) === null || _a === void 0
        ? void 0
        : _a.broadcastEval(input).catch(this.Logger.error);
      return results;
    });
  }
  resolveMember(search, guild) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      let member;
      if (!search || typeof search !== "string") return;
      // Try ID search
      if (search.match(/^<@!?(\d+)>$/)) {
        const id =
          (_a = search.match(/^<@!?(\d+)>$/)) === null || _a === void 0
            ? void 0
            : _a[1];
        if (!id) return;
        member = yield guild.members.fetch(id).catch(this.logger.error);
        if (member) return member;
      }
      // Try username search
      if (search.match(/^!?([^#]+)#(\d+)$/)) {
        yield guild.members.fetch();
        member = guild.members.cache.find((m) => m.user.tag === search);
        if (member) return member;
      }
      member = yield guild.members.fetch(search).catch(this.logger.error);
      return member;
    });
  }
  getApiGuild(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const headers = {
        Authorization: `Bot ${this.config.token}`,
      };
      const apiResult = yield axios_1.default.get(
        `http://discord.com/api/guilds/${id}`,
        {
          headers: headers,
        }
      );
      const data = JSON.parse(apiResult.data);
      return data;
    });
  }
  getApiUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const headers = {
        Authorization: `Bot ${this.config.token}`,
      };
      const apiResult = yield axios_1.default.get(
        `http://discord.com/api/users/${id}`,
        {
          headers: headers,
        }
      );
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
    });
  }
  registerEvents(client, dir = "") {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
      const files = yield promises_1.default.readdir(
        ((_a = require.main) === null || _a === void 0 ? void 0 : _a.path) + dir
      );
      for (const file of files) {
        const stat = yield promises_1.default.lstat(
          ((_b = require.main) === null || _b === void 0 ? void 0 : _b.path) +
            `${dir}/${file}`
        );
        if (stat.isDirectory()) this.registerEvents(client, `${dir}/${file}`);
        if (file.endsWith(".js")) {
          const event = require(((_c = require.main) === null || _c === void 0
            ? void 0
            : _c.path) + `/${dir}/${file}`).default;
          if (event) {
            if (event.prototype instanceof Event_1.default) {
              const evnt = new event(client);
              client.on(evnt.name, evnt.run.bind(evnt, client));
              client.activeEvents.push(evnt.name);
            }
          }
        }
      }
    });
  }
  registerCommands(client, dir = "") {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
      const files = yield promises_1.default.readdir(
        ((_a = require.main) === null || _a === void 0 ? void 0 : _a.path) + dir
      );
      for (const file of files) {
        const stat = yield promises_1.default.lstat(
          ((_b = require.main) === null || _b === void 0 ? void 0 : _b.path) +
            `${dir}/${file}`
        );
        if (stat.isDirectory())
          client.registerCommands(client, `${dir}/${file}`);
        if (file.endsWith(".js")) {
          const command = require(((_c = require.main) === null || _c === void 0
            ? void 0
            : _c.path) + `/${dir}/${file}`).default;
          if (command) {
            if (command.prototype instanceof Command_1.default) {
              const cmd = new command(client);
              client.commands.set(cmd.help.name, cmd);
            }
          }
        }
      }
    });
  }
}
exports.default = Bot;
