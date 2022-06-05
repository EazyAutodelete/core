import Discord from "discord.js";
import { CustomUser, ResponseData } from "../typings";
import Bot from "./Bot";
import Logger from "../utils/Logger";

export default class CommandMessage {
  message: Discord.CommandInteraction;
  channel!: Discord.TextBasedChannel;
  member: Discord.GuildMember;
  author: CustomUser;
  client: Bot;
  guild!: Discord.Guild;
  id: Discord.Snowflake;
  createdTimestamp: number;
  locale: string;
  Logger: Logger;

  constructor(message: Discord.CommandInteraction, client: Bot) {
    this.client = client;
    this.message = message;
    if (message.channel) this.channel = message.channel;
    if (message.guild) this.guild = message.guild;
    this.id = message.id;
    this.createdTimestamp = message.createdTimestamp;

    this.member = this.message.member as Discord.GuildMember;
    this.author = this.message.user as CustomUser;
    this.locale = this.message.locale;
    this.Logger = client.Logger;
  }

  public translate(phrase: string, ...replace: string[]): string {
    console.log(replace);

    return this.client.translate(
      {
        phrase: phrase,
        locale: this.author.settings.language || "en",
      },
      ...replace
    );
  }

  public async sendError(message: string, ...args: string[]): Promise<CommandMessage> {
    try {
      await this.client.response
        .sendError(this, this.translate(message, ...args) || message, true)
        .catch(this.Logger.error);
    } catch (e) {
      this.Logger.error(e as string);
    }

    return this;
  }

  public async sendSuccess(
    message: string,
    ephemeral: boolean | undefined = false,
    ...args: string[]
  ): Promise<CommandMessage> {
    try {
      await this.client.response
        .sendSuccess(this, this.translate(message, ...args) || message, ephemeral)
        .catch(this.Logger.error);
    } catch (e) {
      this.Logger.error(e as string);
    }

    return this;
  }

  public async send(
    message: ResponseData,
    ephemeral: boolean | undefined = false,
    ...args: string[]
  ): Promise<CommandMessage> {
    try {
      await this.client.response
        .send(
          this.message,
          typeof message === "string"
            ? this.translate(message, ...args) || message
            : Array.isArray(message)
            ? message.map(m => {
                return typeof m === "string" ? { description: m } : m;
              })
            : message,
          ephemeral
        )
        .catch(this.Logger.error);
    } catch (e) {
      this.Logger.error(e as string);
    }
    return this;
  }

  async react(emoji: string): Promise<CommandMessage> {
    try {
      await this.message.followUp({
        ephemeral: true,
        content: emoji,
      });
    } catch (e) {
      this.Logger.error(e as string);
    }

    return this;
  }

  async delete(): Promise<CommandMessage | void> {
    try {
      return await this.message.deleteReply().catch(this.Logger.error);
    } catch (e) {
      return this.Logger.error(e as string);
    }
  }

  async edit(payload: Discord.InteractionReplyOptions): Promise<CommandMessage> {
    try {
      await this.message.editReply(payload).catch(this.Logger.error);
    } catch (e) {
      this.Logger.error(e as string);
    }

    return this;
  }

  async continue(): Promise<CommandMessage> {
    try {
      await this.message.deferReply().catch(this.Logger.error);
    } catch (e) {
      this.Logger.error(e as string);
    }

    return this;
  }
}
