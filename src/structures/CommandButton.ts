import { UserSettings, GuildSettings } from "@eazyautodelete/db-client";
import {
  ActionRow,
  ComponentInteraction,
  Embed,
  EmbedOptions,
  Guild,
  InteractionContentEdit,
  Member,
  Message,
  MessageContent,
  TextableChannel,
  User,
} from "eris";
import Base from "./Base";
import Bot from "./Bot";

export default class CommandButton extends Base {
  id: string;
  interaction: ComponentInteraction;
  message: Message;
  channel: TextableChannel;
  member: Member;
  user: User;
  guild: Guild;
  guildId: string;

  data!: { guild: GuildSettings; user: UserSettings };

  constructor(bot: Bot, interaction: ComponentInteraction) {
    super(bot);
    this.message = interaction.message;
    this.interaction = interaction;
    if (interaction.channel) this.channel = interaction.channel;

    this.interaction = interaction;
    this.id = interaction.id;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.guildId = interaction.guildID!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    this.user = this.interaction.member?.user!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.guild = this.bot.client.guilds.get(this.guildId)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.channel = this.interaction.channel!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.member = this.interaction.member!;
  }

  public async loadData() {
    this.data = {
      guild: await this.bot.db.getGuildSettings(this.guildId),
      user: await this.bot.db.getUserSettings(this.user.id),
    };
  }

  public translate(phrase: string, ...replace: string[]): string {
    return this.bot.translate(phrase, this.data.user.language || "en", ...replace);
  }

  public async error(message: string, ...args: string[]): Promise<CommandButton> {
    try {
      await this.send(
        {
          description: this.translate(message, ...args),
          color: this.bot.utils.getColor("error"),
        },
        true
      ).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandButton:error]: ` + e);
    }

    return this;
  }

  public async send(
    message: Embed | Embed[] | EmbedOptions | EmbedOptions[],
    ephemeral: boolean | undefined = false,
    components: ActionRow[] = []
  ): Promise<CommandButton> {
    try {
      const embeds = message instanceof Array ? message : [message];
      if (this.data.user.isNew)
        embeds.unshift({
          title: this.translate("userWelcome"),
          description: this.translate("userIsNew"),
          color: this.bot.utils.getColor("default"),
        });

      await this.bot.response
        .send(this.interaction, embeds, ephemeral, Array.isArray(components) ? components : [components])
        .catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandButton:send]: ` + e);
    }
    return this;
  }

  public async success(message: string, ...args: string[]): Promise<CommandButton> {
    try {
      await this.send(
        {
          description: this.translate(message, ...args),
          color: this.bot.utils.getColor("success"),
        },
        true
      ).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandButton:success]: ` + e);
    }

    return this;
  }

  public async info(message: string, ...args: string[]): Promise<CommandButton> {
    try {
      await this.send(
        {
          description: this.translate(message, ...args),
          color: this.bot.utils.getColor("default"),
        },
        true
      ).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandButton:info]: ` + e);
    }

    return this;
  }

  async delete(): Promise<CommandButton> {
    try {
      if (!this.interaction.message) return this;

      await this.interaction.deleteMessage(this.interaction.message.id).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandButton:delete]: ` + e);
    }
    return this;
  }

  async edit(payload: InteractionContentEdit): Promise<CommandButton> {
    try {
      await this.interaction.editMessage(this.interaction.message.id, payload).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandButton:edit]: ` + e);
    }
    return this;
  }

  async editSource(payload: MessageContent) {
    try {
      await this.interaction.editMessage(this.interaction.message.id, payload).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandButton:editSource]: ` + e);
    }
  }

  async continue(ephemeral = true): Promise<CommandButton> {
    try {
      await this.interaction.defer(ephemeral ? 64 : 0).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandButton:continue]: ` + e);
    }

    return this;
  }

  async deferUpdate() {
    try {
      await this.interaction.deferUpdate().catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandButton:deferUpdate]: ` + e);
    }

    return this;
  }
}
