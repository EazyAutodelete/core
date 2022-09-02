import { stringToMs } from "@eazyautodelete/bot-utils";
import { exec } from "node:child_process";
import { readdir } from "fs/promises";
import Base from "./Base";
import Bot from "./Bot";
import { Client } from "discord.js";
import Command from "./Command";
import path from "path";

class Module extends Base {
  bot: Bot;
  name: String;
  private _registeredListeners: Map<string, Function>;
  private _loadedCommands: Map<string, Command>;
  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;
    this.name = "Module";

    this._registeredListeners = new Map();
    this._loadedCommands = new Map();
  }

  public async build() {
    console.log("Starting to build Module: ", this.name);
    const buildModuleCP = exec("npm run build");
    buildModuleCP.stdout?.on("error", d => console.error(d.toString()));
    await new Promise(resolve => {
      buildModuleCP.on("close", resolve);
    });
    console.log("Built Module: ", this.name);
  }

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
        const command = require(path.join(
          path.resolve(),
          "node_modules",
          "@eazyautodelete",
          this.name.toString(),
          "src",
          "commands",
          file
        ));
        const cmd: Command = new command.default(this.bot);
        cmd.module = this;
        this.bot.commands.register(cmd);
        this._loadedCommands.set(cmd.name, cmd);
      })
    );
  }

  public start(client: Client, ...args: any[]) {
    this.logger.info("Started Module: " + this.name, "MODULE");
  }

  public unload(...args: any[]) {
    this.logger.info("Unloaded Module: " + this.name, "MODULE");
  }

  public _start(client: Client, ...args: any[]) {
    if (this.start) {
      this.start(client, ...args);
    }
  }

  public _unload(...args: any[]) {
    if (this._registeredListeners.size > 0) {
      for (const [event, listener] of this._registeredListeners.entries()) {
        this.bot.dispatcher.unregisterListener(event, listener);
      }
    }

    if (this.unload) {
      this.unload(...args);
    }
  }
}

export default Module;
