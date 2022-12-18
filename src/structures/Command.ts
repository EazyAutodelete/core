import { Cooldown, PermissionLevel } from "..";
import Bot from "./Bot";
import CommandArgs from "./CommandMessageArgs";
import CommandButton from "./CommandButton";
import CommandButtonArgs from "./CommandButtonArgs";
import CommandModal from "./CommandModal";
import CommandModalArgs from "./CommandModalArgs";
import CommandMenu from "./CommandMenu";
import CommandMenuArgs from "./CommandMenuArgs";
import CommandMessage from "./CommandMessage";
import Base from "./Base";
import Module from "./Module";

import { ActionRow, ApplicationCommandOptions, ApplicationCommandStructure, Embed } from "eris";

class Command extends Base {
  public bot: Bot;

  public name: string;
  public aliases: string[];
  public description: string;
  public module!: Module;
  public usage: string;
  public examples: string[];
  public permissionLevel: PermissionLevel;
  public cooldown: Cooldown;
  public botPermissions: bigint[];

  public options: ApplicationCommandOptions[];
  public nameLocalizations: { [index: string]: string };
  public descriptionLocalizations: { [index: string]: string };
  public type: number;
  public dmPermission: boolean;

  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;

    this.type = 1;
    this.dmPermission = false;
    this.name = "";
    this.nameLocalizations = {};
    this.aliases = [];
    this.description = "";
    this.descriptionLocalizations = {};
    this.usage = "";
    this.examples = [];
    this.permissionLevel = "botAdmin";
    this.cooldown = 3000;
    this.botPermissions = [];

    this.options = [];
  }

  public hasCooldown(user: string) {
    return this.bot.cooldowns.hasCooldown(this.name, user);
  }

  get data(): ApplicationCommandStructure {
    return {
      type: 1,

      name: this.name,
      description: this.description,

      options: this.options,
    };
  }

  get embed(): Embed {
    return {
      type: "rich",
      color: this.bot.utils.getColor("default"),
      timestamp: new Date(),
      footer: {
        text: this.bot.client.user.username,
        icon_url: this.bot.client.user.avatarURL,
      },
    };
  }

  urlButton(url: string, label: string, emoji?: string): ActionRow[] {
    return [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: label,
            emoji: emoji ? { name: emoji } : undefined,
            url: url,
          },
        ],
      },
    ];
  }

  docsButton(url: string): ActionRow[] {
    return [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: "Help",
            emoji: { name: "❓" },
            url: "https://docs.eazyautodelete.xyz/" + url,
          },
        ],
      },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(message: CommandMessage, args: CommandArgs): Promise<void> {
    message.error("No run method served for this command.");

    return this.logger.warn(
      "Ended up in command.js [ " + this.name + " - " + message.guild?.id + " - " + message.channel?.id + " ]"
    );
  }

  async autocompleteHandler(query: string): Promise<{ name: string; value: string }[]> {
    this.logger.warn("Ended up in command.js [ " + this.name + " - " + query + " ]");

    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async selectMenuHandler(menu: CommandMenu, args: CommandMenuArgs): Promise<void> {
    this.logger.warn("No Select Menu Handler", this.name);

    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async buttonHandler(button: CommandButton, args: CommandButtonArgs): Promise<void> {
    this.logger.warn("No Button Handler", this.name);

    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async modalHandler(modal: CommandModal, args: CommandModalArgs): Promise<void> {
    this.logger.warn("No Modal Handler", this.name);

    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public unload(...args: any[]) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _unload(...args: any[]) {
    this.bot.commands.delete(this.name);

    if (this.unload) {
      this.unload(...args);
    }

    this.logger.warn(`Unloaded Command ${this.name}`, "COMMAND");
  }
}

export default Command;
