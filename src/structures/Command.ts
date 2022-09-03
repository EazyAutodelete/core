import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  SelectMenuInteraction,
  ApplicationCommandOptionChoiceData,
  ApplicationCommandOptionData,
  ApplicationCommandData,
  ColorResolvable,
  ModalSubmitInteraction,
} from "discord.js";
import { Cooldown, PermissionLevel } from "..";
import Bot from "./Bot";
import ButtonArgs from "./CommandButtonArgs";
import CommandArgs from "./CommandArgs";
import CommandButton from "./CommandButton";
import CommandModal from "./CommandModal";
import CommandModalArgs from "./CommandModalArgs";
import CommandMessage from "./CommandMessage";
import Base from "./Base";
import Module from "./Module";

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

  public shardId: number;

  public data: ApplicationCommandData;
  public options: ApplicationCommandOptionData[];

  constructor(bot: Bot) {
    super(bot);
    this.bot = bot;

    this.name = "";
    this.aliases = [];
    this.description = "";
    this.usage = "";
    this.examples = [];
    this.permissionLevel = "botAdmin";
    this.cooldown = 3000;
    this.botPermissions = [];

    this.options = [];

    this.data = {
      name: this.name,
      description: this.description,
      options: this.options,
    };

    this.shardId = parseInt(this.client.shard?.ids.toString() || "0");
  }

  public hasCooldown(user: string) {
    return this.bot.cooldowns.hasCooldown(this.name, user);
  }

  public t(phrase: string, locale: string, ...args: any[]) {
    return this.bot.translate(phrase, locale, ...args.map(a => new String(a).toString()));
  }

  get embed(): MessageEmbed {
    return new MessageEmbed()
      .setColor(this.bot.utils.getColor("default") as ColorResolvable)
      .setTimestamp()
      .setFooter({
        text: this.client.user!.username,
        iconURL: this.client.user!.displayAvatarURL({ dynamic: true }),
      });
  }

  urlButton(url: string, label: string, emoji?: string): MessageActionRow {
    return new MessageActionRow().addComponents([
      new MessageButton()
        .setDisabled(false)
        .setLabel(label)
        .setEmoji(emoji || "🔗")
        .setStyle("LINK")
        .setURL(url),
    ]);
  }

  docsButton(url: string): MessageActionRow {
    return this.urlButton("https://docs.eazyautodelete.xyz/" + url, "Help", "❓");
  }

  async run(message: CommandMessage, args: CommandArgs): Promise<void> {
    message.error("No run method served for this command.");

    return this.logger.warn(
      "Ended up in command.js [ " + this.name + " - " + message.guild?.id + " - " + message.channel?.id + " ]"
    );
  }

  async autocompleteHandler(query: string): Promise<ApplicationCommandOptionChoiceData[]> {
    this.logger.warn("Ended up in command.js [ " + this.name + " - " + query + " ]");

    return [];
  }

  async selectMenuHandler(interaction: SelectMenuInteraction): Promise<void> {
    this.logger.warn("No Select Menu Handler", this.name);

    return;
  }

  async buttonHandler(button: CommandButton, args: ButtonArgs): Promise<void> {
    this.logger.warn("No Button Handler", this.name);

    return;
  }

  async modalHandler(modal: CommandModal, args: CommandModalArgs): Promise<void> {
    this.logger.warn("No Modal Handler", this.name);

    return;
  }
}

export default Command;
