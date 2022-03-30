import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  CommandInteraction,
  SelectMenuInteraction,
  ApplicationCommandOptionData,
} from "discord.js";
import assets from "../constants/assets/assets";
import colors from "../constants/assets/colors/colors";
import emojis from "../constants/emojis/emojis";
import Bot from "./Bot";

export interface CommandOptions {
  name: string;
  description: string;
  dirname: string;
  permissionLevel: string;
  cooldown: number;
  aliases: Array<string>;
  example: string;
  usage: string;
  options: Array<ApplicationCommandOptionData>;
}

export default class Command {
  client: Bot;
  config: {
    options: ApplicationCommandOptionData[];
    name: string;
    description: string;
    cooldown: number;
    usage: string;
    example: string;
    permissionLevel: string;
  };
  help: {
    name: string;
    description: string;
    permissionLevel: string;
    cooldown: number;
    usage: string;
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
  Logger: import("c:/Users/bensc/OneDrive/Development/Discord Bots/eazyautodelete/eazyautodelete-core/utils/Logger").default;
  reply: (
    interaction: CommandInteraction,
    input: string | MessageEmbed | any,
    ephemeral: boolean | undefined,
    components: MessageActionRow | any
  ) => Promise<void>;
  constructor(
    client: Bot,
    {
      name = "",
      description = "",

      dirname = __dirname,

      permissionLevel = "Bot Dev",

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

    const commandHelpData = {
      name,
      description,
      permissionLevel,
      cooldown,
      usage,
      example,
      aliases,
    };
    this.help = commandHelpData;

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

  async run(interaction: CommandInteraction) {
    return this.Logger.warn("Ended up in command.js [" + this.config + "]");
  }

  autocompleteHandler(query: string) {
    this.Logger.warn("Ended up in command.js [" + this.config + "]");
    return [];
  }

  selectMenuHandler(interaction: SelectMenuInteraction) {
    return;
  }

  translate(options: any) {
    return this.client.translate(options);
  }

  async response(
    interaction: CommandInteraction,
    input: string | MessageEmbed | any,
    ephemeral = true,
    components: MessageActionRow | any
  ) {
    if (typeof input === "object") {
      if (input.description || input.title)
        return await interaction
          .reply({
            embeds: [input],
            components: components.components ? [components] : components,
            ephemeral: ephemeral,
          })
          .catch(this.client.Logger.error);
      else
        return await interaction
          .reply({
            embeds: input,
            components: components.components ? [components] : components,
            ephemeral: ephemeral,
          })
          .catch(this.client.Logger.error);
    } else if (typeof input === "string") {
      return await interaction
        .reply({
          content: input,
          components: components.components ? [components] : components,
          ephemeral: ephemeral,
        })
        .catch(this.client.Logger.error);
    }
  }

  error(interaction: CommandInteraction, text: string) {
    return interaction
      .reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed().setColor("#ff0000").setDescription(":x: " + text),
        ],
      })
      .catch(this.client.Logger.error);
  }

  get embed(): MessageEmbed {
    let embed = new MessageEmbed().setTimestamp().setFooter({
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
