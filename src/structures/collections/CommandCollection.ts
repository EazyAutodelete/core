import { Client } from "discord.js";
import Bot from "../Bot";
import Command from "../Command";
import Logger from "../Logger";
import Module from "../Module";
import Collection from "./Collection";

class CommandCollection extends Collection {
  bot: Bot;
  logger: Logger;
  private _listenerCount: number;
  private _client: Client;
  constructor(bot: Bot) {
    super();

    this.bot = bot;
    this.logger = bot.logger;

    this._listenerCount = 0;
    this._client = bot.client;
  }

  public async loadCommands() {
    await Promise.all(
      this.bot.modules.map(async (module: Module) => {
        await module.loadCommands();
      })
    );
  }

  public register(command: Command) {
    let activeCommand = this.get(command.name);

    if (activeCommand) {
      this.logger.info(`Unloading Command ${command.name}`, "COMMAND");
      activeCommand._unload();
      this.delete(command.name);
    }

    this.logger.info(`Registering command ${command.name}`, "COMMAND");

    this.set(command.name, command);
  }

  public getListenerCount(): number {
    return this._listenerCount;
  }
}

export default CommandCollection;
