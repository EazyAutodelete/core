import { exec } from "child_process";
import { Client } from "discord.js";
import { readdir } from "fs/promises";
import path from "path";
import Bot from "../Bot";
import Logger from "../Logger";
import Module from "../Module";
import Collection from "./Collection";

class ModuleCollection extends Collection {
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

  public async loadModules() {
    const files = await readdir(path.join(path.resolve(), "node_modules", "@eazyautodelete"));

    await Promise.all(
      files.map(async file => {
        await this._buildModule(path.join(path.resolve(), "node_modules", "@eazyautodelete", file));

        const module = require("@eazyautodelete/" + file);
        await this.register(module);
      })
    );
  }

  public async register(requiredModule: any) {
    try {
      if (!requiredModule.default) return;
      let module = new requiredModule.default(this.bot);
      if (!(module instanceof Module)) return;
      let activeModule = this.get(module.name);

      if (activeModule) {
        this.logger.info(`Unloading Module ${module.name}`, "MODULE");
        activeModule._unload();
        this.delete(module.name);
      }

      this.set(module.name, module);

      await Promise.all(
        this.bot.dispatcher.events.map(event => {
          if (!(module as any)[event]) return;
          module.registerListener(event, (module as any)[event] as (...args: any[]) => void);
          this._listenerCount++;
        })
      );

      this.get(module.name)._start(this._client);
    } catch (err) {
      console.error(err);
    }
  }

  private async _buildModule(path: string): Promise<any> {
    const child = exec("npm run build", { cwd: path });

    await new Promise(resolve => {
      child.on("close", resolve);
    });

    return;
  }

  public getListenerCount(): number {
    return this._listenerCount;
  }
}

export default ModuleCollection;
