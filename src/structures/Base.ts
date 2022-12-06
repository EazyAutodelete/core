import { DatabaseHandler } from "@eazyautodelete/db-client";
import { Client } from "eris";
import Bot from "./Bot";
import Logger from "@eazyautodelete/logger";

class Base {
  public bot: Bot;
  private _client: Client;
  private _database: DatabaseHandler;
  private _logger: Logger;

  constructor(bot: Bot) {
    this.bot = bot;
    this._client = bot.client;
    this._database = bot.db;
    this._logger = bot.logger;
  }

  public get client() {
    return this._client;
  }

  public get db() {
    return this._database;
  }

  public get logger() {
    return this._logger;
  }

  public get permissions() {
    return this.bot.permissions;
  }
}

export default Base;
