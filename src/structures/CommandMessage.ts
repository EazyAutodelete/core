import Discord, { MessageActionRow, MessageEmbed, MessageEmbedOptions } from "discord.js";
import Bot from "./Bot";
import Logger from "./Logger";
import { UserSettings, GuildSettings } from "@eazyautodelete/eazyautodelete-db-client";
import { Locale } from "@eazyautodelete/eazyautodelete-lang";

export default class CommandMessage {
  message: Discord.CommandInteraction;
  channel!: Discord.TextBasedChannel;
  member: Discord.GuildMember;
  author: Discord.User;
  client: Bot;
  guild!: Discord.Guild;
  id: Discord.Snowflake;
  createdTimestamp: number;
  locale: string;
  Logger: Logger;
  data!: { guild: GuildSettings; user: UserSettings };

  constructor(message: Discord.CommandInteraction, client: Bot) {
    this.client = client;
    this.message = message;
    if (message.channel) this.channel = message.channel;
    if (message.guild) this.guild = message.guild;
    this.id = message.id;
    this.createdTimestamp = message.createdTimestamp;
    this.member = this.message.member as Discord.GuildMember;
    this.author = this.message.user as Discord.User;
    this.locale = this.message.locale;
    this.Logger = client.Logger;
  }

  public async loadData() {
    this.data = {
      guild: await this.client.database.getGuildSettings(
        this.message.guild?.id as string
      ),
      user: await this.client.database.getUserSettings(this.author.id),
    };
  }

  public translate(phrase: string, ...replace: string[]): string {
    const data = this.client.translate(
      {
        phrase: phrase,
        locale: (this.data.user.language as Locale) || "en",
      },
      ...replace
    );

    return data || phrase;
  }

  public async error(message: string, ...args: string[]): Promise<CommandMessage> {
    try {
      await this.send(
        new MessageEmbed({
          description: this.translate(message, ...args) || message,
        }).setColor("#ff0000"),
        true
      ).catch(this.Logger.error);
    } catch (e) {
      this.Logger.error(e as string);
    }

    return this;
  }

  public async send(
    message: MessageEmbed | MessageEmbed[] | MessageEmbedOptions | MessageEmbedOptions[],
    ephemeral: boolean | undefined = false,
    components: MessageActionRow | MessageActionRow[] = []
  ): Promise<CommandMessage> {
    try {
      await this.client.response
        .send(
          this.message,
          Array.isArray(message)
            ? message.map((m: MessageEmbed | MessageEmbedOptions) => {
                return m instanceof MessageEmbed ? m : new MessageEmbed(m);
              })
            : [message instanceof MessageEmbed ? message : new MessageEmbed(message)],
          ephemeral,
          Array.isArray(components) ? components : [components]
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
