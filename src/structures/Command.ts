import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  SelectMenuInteraction,
  ButtonInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";
import { CommandConfig, CommandData, CommandHelp, CommandOptions } from "../";
import Bot from "./Bot";
import Logger from "./Logger";
import CommandMessage from "./CommandMessage";
import Args from "./Args";

export default class Command {
  client: Bot;
  config: CommandConfig;
  help: CommandHelp;
  data: CommandData;
  Logger: Logger;
  shardId: number[] | undefined;
  constructor(
    client: Bot,
    {
      name = "",
      description = "",

      dirname = __dirname,

      permissionLevel = 1,

      botPermissions = [],

      cooldown = 5000,

      aliases = [],

      example = "",

      usage = "",

      options = [],
    }: CommandOptions
  ) {
    this.client = client;

    this.config = {
      options,
      name,
      description,
      cooldown,
      usage,
      example,
      permissionLevel,
      botPermissions,
    };

    this.help = {
      name,
      description,
      permissionLevel,
      cooldown,
      category: dirname.split("\\")[dirname.split("\\").length - 1],
      usage,
      example,
      aliases,
    };

    this.data = {
      name: this.help.name,
      description: this.help.description,
      options: this.config.options,
    };

    this.Logger = client?.Logger;

    this.shardId = client.shard?.ids;
  }

  get embed(): MessageEmbed {
    return new MessageEmbed({ color: 4605931 }).setTimestamp().setFooter({
      text: "EazyAutodelete",
      iconURL:
        "https://cdn.discordapp.com/avatars/748215564455116961/ff37be1ab3cdf46c6c4179dcc9c11a91.png?size=1024",
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

  async run(client: Bot, interaction: CommandMessage, args: Args): Promise<void> {
    interaction.error("An Error occured - Please contact staff: Core.Command.run");

    return this.Logger.warn(
      "Ended up in command.js [ " +
        this.config.name +
        " - " +
        interaction.guild?.id +
        " - " +
        interaction.channel?.id +
        " ]"
    );
  }

  async autocompleteHandler(
    query: string
  ): Promise<ApplicationCommandOptionChoiceData[]> {
    this.Logger.warn(
      "Ended up in command.js [ " + this.config.name + " - " + query + " ]"
    );

    return [];
  }

  async selectMenuHandler(interaction: SelectMenuInteraction): Promise<void> {
    this.Logger.warn(
      "Ended up in command.js [ " + this.config.name + " - " + interaction.id + " ]"
    );

    return;
  }

  async buttonHandler(interaction: ButtonInteraction): Promise<void> {
    this.Logger.warn(
      "Ended up in command.js [ " + this.config.name + " - " + interaction.id + " ]"
    );

    return;
  }
}
