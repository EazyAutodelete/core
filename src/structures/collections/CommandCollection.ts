import Bot from "../Bot";
import Command from "../Command";
import Logger from "@eazyautodelete/logger";
import Module from "../Module";
import Collection from "./Collection";

class CommandCollection extends Collection {
  bot: Bot;
  logger: Logger;
  private _listenerCount: number;
  constructor(bot: Bot) {
    super();

    this.bot = bot;
    this.logger = bot.logger;

    this._listenerCount = 0;
  }

  public async loadCommands() {
    await Promise.all(
      this.bot.modules.map(async (module: Module) => {
        await module.loadCommands();
      })
    );
  }

  public register(command: Command) {
    const activeCommand = this.get(command.name);

    if (activeCommand) {
      this.logger.info(`[💬] Unloading Command '${command.name}'`, "CMND");
      activeCommand._unload();
      this.delete(command.name);
    }

    this.set(command.name, command);

    this.logger.info(`[💬] Loaded command '${command.name}'`, "CMND");
  }

  public unregister(command: Command) {
    command._unload();
    this.delete(command.name);
    this.logger.info(`[💬] Unregistered Command '${command.name}'`, "CMND");
  }

  public getListenerCount(): number {
    return this._listenerCount;
  }
}

export default CommandCollection;
