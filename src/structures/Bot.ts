import { DatabaseHandler } from "@eazyautodelete/db-client";
import Translator from "@eazyautodelete/translator";
import { Client, ClientOptions, Intents } from "discord.js";
import CommandCollection from "./collections/CommandCollection";
import ModuleCollection from "./collections/ModuleCollection";
import Logger from "@eazyautodelete/logger";
import CooldownsManager from "./managers/CooldownsManager";
import Dispatcher from "./managers/Dispatcher";
import PermissionsManager from "./managers/PermissionsManager";
import ResponseManager from "./managers/ResponseManager";
import * as utils from "@eazyautodelete/bot-utils";
import { BotOptions } from "..";

class Bot {
  public isReady: boolean;
  public startTime: number;
  public dispatcher!: Dispatcher;
  public modules!: ModuleCollection;
  public commands!: CommandCollection;
  public permissions!: PermissionsManager;
  public cooldowns!: CooldownsManager;
  public response!: ResponseManager;
  public staff!: { botAdmins: string[]; botMods: string[] };

  private _logger!: Logger;
  private _client!: Client;
  private _database!: DatabaseHandler;
  private _config!: any;
  private _i18n!: Translator;
  private _clientOptions!: ClientOptions;

  private _token!: string;

  public staffServer: any;
  public supportServer: any;

  utils!: typeof utils;

  constructor() {
    this.isReady = false;
    this.startTime = Date.now();
  }

  public get client(): Client {
    return this._client;
  }

  public get logger(): Logger {
    return this._logger;
  }

  public get config() {
    return this._config;
  }

  public get db() {
    return this._database;
  }

  public get uptime() {
    return Date.now() - this.startTime;
  }

  public shard(): number {
    return this._client?.shard?.ids?.[0] || 0;
  }

  public async setup(options: BotOptions) {
    this._config = {};
    await this._configure(options);

    this.utils = utils;

    this._client = new Client(this._clientOptions);

    this._client.on("error", err => this._logger.error(err.toString()));
    this._client.on("warn", err => this._logger.warn(err.toString()));
    this._client.on("debug", err => this._logger.debug(err.toString()));
    this._client.on("ready", () => {
      this._client.emit("clientReady");
    });

    this._logger = new Logger(this.shard());

    this._database = new DatabaseHandler({ mongo: this._config.mongo, redis: this._config.redis }, this._logger);
    await this._database.connect();

    this.dispatcher = new Dispatcher(this);

    this.modules = new ModuleCollection(this);
    await this.modules.loadModules();

    this.commands = new CommandCollection(this);
    await this.commands.loadCommands();

    this._i18n = new Translator(this._config.weblate_token);
    await this._i18n.loadMessages();

    this.cooldowns = new CooldownsManager(this);
    this.permissions = new PermissionsManager(this);
    this.response = new ResponseManager(this);

    this.login();
  }

  private async _configure(options: any = {}) {
    this._clientOptions = {
      intents: options.intents || [
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
      partials: options.partials || ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    };

    this._token = options.token;

    this.staffServer = options.staffServer;
    this.supportServer = options.supportServer;

    this._config.mongo = {
      uri: options.mongo.uri,
      host: options.mongo.host,
      port: options.mongo.port,
      username: options.mongo.username,
      password: options.mongo.password,
    };
    this._config.redis = {
      host: options.redis.host,
      port: options.redis.port,
      password: options.redis.password,
    };

    this._config.sharding = {
      shardCount: options.sharding.shardCount || 1,
      shardList: options.sharding.shardList || [0],
      id: options.sharding.id || 0,
    };

    this.staff = {
      botAdmins: options.staff.botAdmins || [],
      botMods: options.staff.botMods || [],
    };

    this._config.weblate_token = options.weblate_token;
  }

  public login() {
    this._client.login(this._token);
  }

  public translate(key: string, language: string, ...args: string[]): string {
    return this._i18n.translate(key, language, ...args) || key;
  }
}

export default Bot;
