import Discord, { MessageActionRow, MessageEmbed } from "discord.js";
import { colorToInt } from "@eazyautodelete/bot-utils";
import Bot from "../Bot";
import CommandMessage from "../CommandMessage.js";
import Logger from "../Logger";

type Message =
  | CommandMessage
  | Discord.ModalSubmitInteraction
  | Discord.ButtonInteraction
  | Discord.CommandInteraction;

export default class CommandResponseHandler {
  Logger: Logger;
  client: Bot;

  constructor(client: Bot) {
    this.client = client;
    this.Logger = client.Logger;
  }

  async send(
    message: Message,
    data: MessageEmbed[],
    ephemeral: boolean = false,
    components: MessageActionRow[] = []
  ): Promise<void> {
    try {
      if (message instanceof CommandMessage) {
        await message.send(data, ephemeral, components).catch(this.Logger.error);
        return;
      } else
        message.deferred
          ? await message
              .editReply({ embeds: data, components: components })
              .catch(this.Logger.error)
          : await message
              .reply({ embeds: data, ephemeral, components: components })
              .catch(this.Logger.error);
    } catch (e) {
      this.Logger.error(e as string);
    }

    return;
  }
}
