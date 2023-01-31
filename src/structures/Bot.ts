import { DatabaseHandler } from "@eazyautodelete/db-client";
import Translator from "@eazyautodelete/translator";
import { Client, ClientOptions, ExtendedUser, Shard } from "eris";
import CommandCollection from "./collections/CommandCollection";
import ModuleCollection from "./collections/ModuleCollection";
import Logger from "@eazyautodelete/logger";
import CooldownsManager from "./managers/CooldownsManager";
import Dispatcher from "./managers/Dispatcher";
import PermissionsManager from "./managers/PermissionsManager";
import ResponseManager from "./managers/ResponseManager";
import * as utils from "@eazyautodelete/bot-utils";
import { BotOptions } from "..";
import * as sharding from "discord-hybrid-sharding";

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

  private _clientOptions!: ClientOptions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _config!: any;
  private _i18n!: Translator;

  private _token!: string;

  public staffServer!: string;
  public supportServer!: string;

  utils!: typeof utils;

  shardList!: number[];

  constructor() {
    this.isReady = false;
    this.startTime = Date.now();
  }

  public get cluster(): sharding.Client {
    return (<any>this._client).cluster;
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

  public get Translator() {
    return this._i18n;
  }

  public get user(): ExtendedUser {
    return this._client.user;
  }

  public get shard(): Shard | undefined {
    return this._client.guilds.random()?.shard;
  }

  public get shardId(): number {
    return this.shard?.id || 0;
  }

  public async setup(options: BotOptions) {
    this._config = {};
    await this._configure(options);

    this.utils = utils;

    this._client = new Client(this._token, this._clientOptions);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>this._client).cluster = new sharding.Client(this._client);

    this._client.on("error", err => this._logger.error(err.stack || err.toString()));
    this._client.on("warn", err => {
      err && ("string" != typeof err || !err.startsWith("Invalid session")) && this._logger.warn(err);
    });
    this._client.on("ready", () => {
      this._client.emit("clientReady");

      this._logger.info("-", "BLANK");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._logger.info(`Cluster #${(<any>this._client).cluster.id} is ready!`, "CLSTR");
      this._logger.info(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `Cluster #${(<any>this._client).cluster.id} is serving shards ${this.shardList.join(", ")}`,
        "CLSTR"
      );
      this._logger.info("-", "BLANK");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any>this._client).cluster.triggerReady();
    });

    this._client.on("shardReady", id => {
      this._logger.info(`Shard #${id} ready`, "SHARD");
      this._client.shards
        .find(x => x.id === id)
        ?.editStatus("online", {
          name: `/help | ${this._client.user.username} | #${id}`,
          type: 3,
        });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._logger = new Logger({ shardId: this.shardId, clusterId: (<any>this._client).cluster.id });

    this._database = new DatabaseHandler({ mongo: this._config.mongo, redis: this._config.redis }, this._logger);
    await this._database.connect();

    this.dispatcher = new Dispatcher(this);

    this.modules = new ModuleCollection(this);
    await this.modules.loadModules();

    this.commands = new CommandCollection(this);
    await this.commands.loadCommands();

    this._i18n = new Translator(this._config.weblate_token, this._logger);
    await this._i18n.loadMessages();

    this.cooldowns = new CooldownsManager(this);
    this.permissions = new PermissionsManager(this);
    this.response = new ResponseManager(this);

    await this.login();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async _configure(options: any = {}) {
    this._clientOptions = {
      intents: options.gateway.intents || ["guildMembers", "guilds", "messageContent", "guildMessages"],
      maxShards: options.sharding.maxShards || 1,
      firstShardID: options.sharding.firstShardID || 0,
      lastShardID: options.sharding.lastShardID || 0,
      messageLimit: options.performance.messageLimit || 100,
      getAllUsers: options.performance.getAllUsers || false,
    };

    this._config.sharding = options.sharding;

    this.shardList = options.sharding.shardList || [0];

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

    this.staff = {
      botAdmins: options.staff.botAdmins || [],
      botMods: options.staff.botMods || [],
    };

    this._config.performance = options.performance;

    this._config.commands = options.commands;

    this._config.weblate_token = options.weblate_token;
  }

  public async login() {
    await this._client.connect();
    this._logger.setShardId(this.shardId);
  }

  public translate(key: string, language: string, ...args: string[]): string {
    return this._i18n.translate(key, language, ...args) || key;
  }
}

export default Bot;
