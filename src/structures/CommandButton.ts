import {
  ButtonInteraction,
  ColorResolvable,
  Guild,
  GuildMember,
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageEmbedOptions,
  Snowflake,
  TextBasedChannel,
  User,
} from "discord.js";
import { UserSettings, GuildSettings } from "@eazyautodelete/db-client";
import Base from "./Base";
import Bot from "./Bot";

export default class CommandButton extends Base {
  channel!: TextBasedChannel;
  member: GuildMember;
  author: User;
  guild!: Guild;
  id: Snowflake;
  createdTimestamp: number;
  locale: string;
  data!: { guild: GuildSettings; user: UserSettings };
  message: Message;
  interaction: ButtonInteraction;

  constructor(bot: Bot, interaction: ButtonInteraction) {
    super(bot);
    this.message = interaction.message as Message;
    this.interaction = interaction;
    if (interaction.channel) this.channel = interaction.channel;
    if (interaction.guild) this.guild = interaction.guild;
    this.id = interaction.id;
    this.createdTimestamp = interaction.createdTimestamp;
    this.member = this.interaction.member as GuildMember;
    this.author = this.interaction.user as User;
    this.locale = this.interaction.locale;
  }

  public async loadData() {
    this.data = {
      guild: await this.bot.db.getGuildSettings(this.interaction.guild?.id as string),
      user: await this.bot.db.getUserSettings(this.author.id),
    };
  }

  public translate(phrase: string, ...replace: string[]): string {
    return this.bot.translate(phrase, this.data.user.language || "en", ...replace);
  }

  public async error(message: string, ...args: string[]): Promise<CommandButton> {
    try {
      await this.send(
        new MessageEmbed({
          description: this.translate(message, ...args),
        }).setColor("#ff0000"),
        true
      ).catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
    }

    return this;
  }

  public async send(
    message: MessageEmbed | MessageEmbed[] | MessageEmbedOptions | MessageEmbedOptions[],
    ephemeral: boolean | undefined = false,
    components: MessageActionRow | MessageActionRow[] = []
  ): Promise<CommandButton> {
    try {
      await this.bot.response
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
        .catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
    }
    return this;
  }

  public async success(message: string, ...args: string[]): Promise<CommandButton> {
    try {
      await this.send(
        new MessageEmbed({
          description: this.translate(message, ...args),
        }).setColor(this.bot.utils.getColor("success") as ColorResolvable),
        true
      ).catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
    }

    return this;
  }

  public async info(message: string, ...args: string[]): Promise<CommandButton> {
    try {
      await this.send(
        new MessageEmbed({
          description: this.translate(message, ...args),
        }).setColor(this.bot.utils.getColor("default") as ColorResolvable),
        true
      ).catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
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
      this.logger.error(e as string);
    }

    return this;
  }

  async delete(): Promise<CommandButton | void> {
    try {
      return await this.interaction.deleteReply().catch(this.logger.error);
    } catch (e) {
      return this.logger.error(e as string);
    }
  }

  async edit(payload: InteractionReplyOptions): Promise<CommandButton> {
    try {
      await this.interaction.editReply(payload).catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
    }

    return this;
  }

  async continue(ephemeral: boolean = true): Promise<CommandButton> {
    try {
      await this.interaction.deferReply({ ephemeral: ephemeral }).catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
    }

    return this;
  }

  async deferUpdate() {
    try {
      await this.interaction.deferUpdate().catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
    }

    return this;
  }
}
