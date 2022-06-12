import Discord, { MessageActionRow, MessageEmbed, MessageEmbedOptions } from "discord.js";
import Bot from "./Bot";
import Logger from "./Logger";
import { UserSettings, GuildSettings } from "@eazyautodelete/eazyautodelete-db-client";
import { Locale } from "@eazyautodelete/eazyautodelete-lang";

export default class CommandButton {
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
  message: Discord.Message;
  interaction: Discord.ButtonInteraction;

  constructor(interaction: Discord.ButtonInteraction, client: Bot) {
    this.client = client;
    this.message = interaction.message as Discord.Message;
    this.interaction = interaction;
    if (interaction.channel) this.channel = interaction.channel;
    if (interaction.guild) this.guild = interaction.guild;
    this.id = interaction.id;
    this.createdTimestamp = interaction.createdTimestamp;
    this.member = this.interaction.member as Discord.GuildMember;
    this.author = this.interaction.user as Discord.User;
    this.locale = this.interaction.locale;
    this.Logger = client.Logger;
  }

  public async loadData() {
    this.data = {
      guild: await this.client.database.getGuildSettings(
        this.message.guild?.id as string
      ),
      user: await this.client.database.getUserSettings(this.message.id),
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

  public async error(message: string, ...args: string[]): Promise<CommandButton> {
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
  ): Promise<CommandButton> {
    try {
      await this.client.response
        .send(
          this.interaction,
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

  async react(emoji: string): Promise<CommandButton> {
    try {
      await this.interaction.followUp({
        ephemeral: true,
        content: emoji,
      });
    } catch (e) {
      this.Logger.error(e as string);
    }

    return this;
  }

  async delete(): Promise<CommandButton | void> {
    try {
      return await this.interaction.deleteReply().catch(this.Logger.error);
    } catch (e) {
      return this.Logger.error(e as string);
    }
  }

  async edit(payload: Discord.InteractionReplyOptions): Promise<CommandButton> {
    try {
      await this.interaction.editReply(payload).catch(this.Logger.error);
    } catch (e) {
      this.Logger.error(e as string);
    }

    return this;
  }

  async continue(): Promise<CommandButton> {
    try {
      await this.interaction.deferReply().catch(this.Logger.error);
    } catch (e) {
      this.Logger.error(e as string);
    }

    return this;
  }
}
