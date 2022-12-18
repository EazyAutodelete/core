import { readdir } from "fs/promises";
import Base from "./Base";
import Bot from "./Bot";
import Command from "./Command";
import path from "path";

class Module extends Base {
  bot: Bot;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _registeredListeners: Map<string, (...args: any[]) => void>;
  private _loadedCommands: Map<string, Command>;
  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;
    this.name = "Module";

    this._registeredListeners = new Map();
    this._loadedCommands = new Map();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public registerListener(event: string, listener: (...args: any[]) => void) {
    this.bot.dispatcher.registerListener(event, listener, this);
    this._registeredListeners.set(event, listener);
  }

  public async loadCommands() {
    const files = await readdir(
      path.join(path.resolve(), "node_modules", "@eazyautodelete", this.name.toString(), "src", "commands")
    );

    await Promise.all(
      files.map(async file => {
        if (!file.endsWith(".js")) return;

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command = require(path.join(
          path.resolve(),
          "node_modules",
          "@eazyautodelete",
          this.name.toString(),
          "src",
          "commands",
          file
        ));
        if (!command || !command.default) return;
        const cmd: Command = new command.default(this.bot);
        cmd.module = this;
        this.bot.commands.register(cmd);
        this._loadedCommands.set(cmd.name, cmd);
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public start(...args: any[]) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public unload(...args: any[]) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _start(...args: any[]) {
    if (this.start) {
      this.start(...args);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _unload(...args: any[]) {
    if (this._registeredListeners.size > 0) {
      for (const [event, listener] of this._registeredListeners.entries()) {
        this.bot.dispatcher.unregisterListener(event, listener);
      }
    }

    if (this.unload) {
      this.unload(...args);
    }

    this._loadedCommands.forEach(cmd => {
      this.bot.commands.unregister(cmd);
    });

    this.logger.warn(`[🧱] Unloaded Module ${this.name}`, "MDUL");
  }
}

export default Module;
