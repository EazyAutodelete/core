import { readdir } from "fs/promises";
import path from "path";
import Bot from "../Bot";
import Logger from "@eazyautodelete/logger";
import Module from "../Module";
import Collection from "./Collection";

class ModuleCollection extends Collection {
  bot: Bot;
  logger: Logger;
  private _listenerCount: number;
  constructor(bot: Bot) {
    super();

    this.bot = bot;
    this.logger = bot.logger;

    this._listenerCount = 0;
  }

  public async loadModules() {
    const files = await readdir(path.join(path.resolve(), "node_modules", "@eazyautodelete"));

    console.log(files);

    await Promise.all(
      files.map(async file => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const module = require("@eazyautodelete/" + file);
        console.log(module, module.default);
        await this.register(module);
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async register(requiredModule: any) {
    try {
      if (!requiredModule || !requiredModule.default) return;
      const module = new requiredModule.default(this.bot);
      if (!(module instanceof Module)) return;
      const activeModule = this.get(module.name);

      if (activeModule) {
        activeModule._unload();
        this.delete(module.name);
      }

      this.set(module.name, module);

      await Promise.all(
        this.bot.dispatcher.events.map(event => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (!(module as any)[event]) return;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          module.registerListener(event, (module as any)[event] as (...args: any[]) => void);
          this._listenerCount++;
        })
      );

      this.get(module.name)._start(this.bot);
    } catch (err) {
      console.error(err);
    }
  }

  public getListenerCount(): number {
    return this._listenerCount;
  }
}

export default ModuleCollection;
