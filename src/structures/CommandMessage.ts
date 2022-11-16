import {
  ColorResolvable,
  CommandInteraction,
  Guild,
  GuildMember,
  InteractionReplyOptions,
  MessageActionRow,
  MessageEmbed,
  MessageEmbedOptions,
  Snowflake,
  TextBasedChannel,
  User,
} from "discord.js";
import Bot from "./Bot";
import { UserSettings, GuildSettings } from "@eazyautodelete/db-client";
import Base from "./Base";

class CommandMessage extends Base {
  message: CommandInteraction;
  channel!: TextBasedChannel;
  member: GuildMember;
  author: User;
  guild!: Guild;
  id: Snowflake;
  createdTimestamp: number;
  locale: string;
  data!: { guild: GuildSettings; user: UserSettings };

  constructor(bot: Bot, message: CommandInteraction) {
    super(bot);

    this.message = message;
    if (message.channel) this.channel = message.channel;
    if (message.guild) this.guild = message.guild;
    this.id = message.id;
    this.createdTimestamp = message.createdTimestamp;
    this.member = this.message.member as GuildMember;
    this.author = this.message.user as User;
    this.locale = this.message.locale;
  }

  public async loadData() {
    this.data = {
      guild: await this.db.getGuildSettings(this.message.guild?.id as string),
      user: await this.db.getUserSettings(this.author.id),
    };
  }

  public translate(phrase: string, ...replace: string[]): string {
    return this.bot.translate(phrase, this.data.user.language || "en", ...replace);
  }

  public async error(message: string, ...args: string[]): Promise<CommandMessage> {
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
  ): Promise<CommandMessage> {
    try {
      let embeds;
      if (Array.isArray(message))
        embeds = message.map((m: MessageEmbed | MessageEmbedOptions) => {
          return m instanceof MessageEmbed ? m : new MessageEmbed(m);
        });
      else embeds = [message instanceof MessageEmbed ? message : new MessageEmbed(message)];

      if (this.data.user.isNew)
        embeds.unshift(
          new MessageEmbed({
            title: this.translate("userWelcome"),
            description: this.translate("userIsNew"),
            color: this.bot.utils.getColor("default") as ColorResolvable,
          })
        );

      await this.bot.response
        .send(this.message, embeds, ephemeral, Array.isArray(components) ? components : [components])
        .catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
    }
    return this;
  }

  public async success(message: string, ...args: string[]): Promise<CommandMessage> {
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

  public async info(message: string, ...args: string[]): Promise<CommandMessage> {
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

  async react(emoji: string): Promise<CommandMessage> {
    try {
      await this.message.followUp({
        ephemeral: true,
        content: emoji,
      });
    } catch (e) {
      this.logger.error(e as string);
    }

    return this;
  }

  async delete(): Promise<CommandMessage | void> {
    try {
      return await this.message.deleteReply().catch(this.logger.error);
    } catch (e) {
      return this.logger.error(e as string);
    }
  }

  async edit(payload: InteractionReplyOptions): Promise<CommandMessage> {
    try {
      await this.message.editReply(payload).catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
    }

    return this;
  }

  async continue(): Promise<CommandMessage> {
    try {
      await this.message.deferReply().catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
    }

    return this;
  }
}

export default CommandMessage;
