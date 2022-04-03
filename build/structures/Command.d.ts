import {
  MessageEmbed,
  MessageActionRow,
  CommandInteraction,
  SelectMenuInteraction,
  ApplicationCommandOptionData,
} from "discord.js";
import { AutocompleteOption, CommandOptions } from "../typings";
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
      name,
      description,
      dirname,
      permissionLevel,
      cooldown,
      aliases,
      example,
      usage,
      options,
    }: CommandOptions
  );
  docsButton(url: string): MessageActionRow;
  run(client: Bot, interaction: CommandInteraction): Promise<void>;
  autocompleteHandler(query: string): AutocompleteOption[];
  selectMenuHandler(interaction: SelectMenuInteraction): void;
  response(
    interaction: CommandInteraction,
    input: string | MessageEmbed | MessageEmbed[],
    ephemeral: boolean,
    components?: MessageActionRow
  ): Promise<void>;
  error(interaction: CommandInteraction, text: string): Promise<void>;
  get embed(): MessageEmbed;
  get shard(): number[] | undefined;
}
