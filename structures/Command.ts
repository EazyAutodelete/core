import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  CommandInteraction,
  SelectMenuInteraction,
  ApplicationCommandOptionData,
} from "discord.js";
import { AutocompleteOption, CommandOptions, Cooldown, PermissionLevel } from "../typings";
import assets from "../constants/assets/assets";
import colors from "../constants/assets/colors/colors";
import emojis from "../constants/emojis/emojis";
import Bot from "./Bot";
import Logger from "../utils/Logger";

export default class Command {
  client: Bot;
  config: {
    options: ApplicationCommandOptionData[];
    name: string;
    description: string;
    cooldown: Cooldown;
    usage: string;
    example: string;
    permissionLevel: PermissionLevel;
  };
  help: {
    name: string;
    description: string;
    permissionLevel: PermissionLevel;
    cooldown: Cooldown;
    usage: string;
    category: string;
    example: string;
    aliases: string[];
  };
  data: {
    name: string;
    description: string;
    options: Array<ApplicationCommandOptionData>;
  };
  assets: typeof assets;
  colors: typeof colors;
  emojis: typeof emojis;
  Logger: Logger;
  reply: (
    interaction: CommandInteraction,
    input: string | MessageEmbed | MessageEmbed[],
    ephemeral: boolean,
    components?: MessageActionRow | undefined
  ) => Promise<void>;
  constructor(
    client: Bot,
    {
      name = "",
      description = "",

      dirname = __dirname,

      permissionLevel = 1,

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

    this.assets = this.client.assets;

    this.colors = this.assets.colors;

    this.emojis = this.client.customEmojis;

    this.Logger = client?.Logger;

    this.reply = this.response;
  }

  docsButton(url: string) {
    return new MessageActionRow().addComponents([
      new MessageButton()
        .setDisabled(false)
        .setEmoji("❓")
        .setLabel("Help")
        .setStyle("LINK")
        .setURL(url),
    ]);
  }

  async run(client: Bot, interaction: CommandInteraction): Promise<void> {
    return this.Logger.warn(
      "Ended up in command.js [ " +
        this.config +
        " - " +
        interaction.guild?.id +
        " - " +
        interaction.channel?.id +
        " ]"
    );
  }

  autocompleteHandler(query: string): AutocompleteOption[] {
    this.Logger.warn(
      "Ended up in command.js [ " + this.config + " - " + query + " ]"
    );

    return [];
  }

  selectMenuHandler(interaction: SelectMenuInteraction) {
    this.Logger.warn(
      "Ended up in command.js [ " + this.config + " - " + interaction.id + " ]"
    );

    return;
  }

  async response(
    interaction: CommandInteraction,
    input: string | MessageEmbed | MessageEmbed[],
    ephemeral: boolean,
    components?: MessageActionRow
  ): Promise<void> {
    if (typeof input === "string") {
      return await interaction
        .reply({
          content: input,
          ephemeral: ephemeral,
          components: components?.components ? [components] : [],
        })
        .catch(this.client.Logger.error);
    } else if (Array.isArray(input)) {
      return await interaction
        .reply({
          embeds: input,
          ephemeral: ephemeral,
          components: components?.components ? [components] : [],
        })
        .catch(this.client.Logger.error);
    } else if (input.description || input.title) {
      return await interaction
        .reply({
          embeds: [input],
          ephemeral: ephemeral,
          components: components?.components ? [components] : [],
        })
        .catch(this.client.Logger.error);
    }
  }

  async error(interaction: CommandInteraction, text: string) {
    await interaction
      .reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed().setColor("#ff0000").setDescription(":x: " + text),
        ],
      })
      .catch(this.client.Logger.error);
  }

  get embed(): MessageEmbed {
    const embed = new MessageEmbed().setTimestamp().setFooter({
      text: "EazyAutodelete",
      iconURL:
        "https://cdn.discordapp.com/avatars/748215564455116961/ff37be1ab3cdf46c6c4179dcc9c11a91.png?size=1024",
    });

    embed.color = 4605931;
    return embed;
  }

  get shard() {
    return this.client.shard?.ids;
  }
}
