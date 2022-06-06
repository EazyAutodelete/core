import Discord from "discord.js";
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

  async sendError(
    message: Message,
    embed: string | Discord.MessageEmbedOptions,
    ephemeral = true
  ): Promise<void> {
    if (typeof embed === "string") embed = { description: embed };
    embed.color = colorToInt(this.client.colors.error as string);
    return this.send(message, embed, ephemeral);
  }

  async sendSuccess(
    message: Message,
    embed: string | Discord.MessageEmbedOptions | Discord.MessageEmbedOptions[],
    ephemeral = false
  ): Promise<void> {
    if (typeof embed === "string") embed = { description: embed };
    Array.isArray(embed) || (embed.color = colorToInt(this.client.colors.succesfull as string));
    return this.send(message, embed, ephemeral);
  }

  async send(
    message: Message,
    data: string | Discord.MessageEmbedOptions | Discord.MessageEmbedOptions[],
    ephemeral = false
  ): Promise<void> {
    try {
      if (typeof data === "string") data = { description: data };
      const responseData: Discord.MessageEmbedOptions[] = Array.isArray(data)
        ? data.map(embed => {
            return (
              embed.color || (embed.color = colorToInt(this.client.colors.default as string)), embed
            );
          })
        : [data];
      if (message instanceof CommandMessage) {
        await message.send(data, ephemeral).catch(this.Logger.error);
        return;
      } else
        message.deferred
          ? await message.editReply({ embeds: responseData }).catch(this.Logger.error)
          : await message
              .reply({ embeds: responseData, ephemeral })
              .catch(this.Logger.error);
    } catch (e) {
      this.Logger.error(e as string);
    }

    return;
  }
}
