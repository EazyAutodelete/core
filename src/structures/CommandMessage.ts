import { UserSettings, GuildSettings } from "@eazyautodelete/db-client";
import {
  ActionRow,
  Embed,
  EmbedOptions,
  Guild,
  InteractionContentEdit,
  Member,
  TextableChannel,
  CommandInteraction,
  User,
} from "eris";
import Base from "./Base";
import Bot from "./Bot";

class CommandMessage extends Base {
  id: string;
  interaction: CommandInteraction;
  channel: TextableChannel;
  member: Member;
  user: User;
  guild: Guild;
  guildId: string;

  data!: { guild: GuildSettings; user: UserSettings };

  constructor(bot: Bot, interaction: CommandInteraction) {
    super(bot);
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

  public async error(message: string, ...args: string[]): Promise<CommandMessage> {
    try {
      await this.send(
        {
          description: this.translate(message, ...args),
          color: this.bot.utils.getColor("error"),
        },
        true
      ).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandMessage:error]: ` + e);
    }

    return this;
  }

  public async send(
    message: Embed | Embed[] | EmbedOptions | EmbedOptions[],
    ephemeral: boolean | undefined = false,
    components: ActionRow[] = []
  ): Promise<CommandMessage> {
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
      this.logger.error(`[Core:CommandMessage:send]: ` + e);
    }
    return this;
  }

  public async success(message: string, ...args: string[]): Promise<CommandMessage> {
    try {
      await this.send(
        {
          description: this.translate(message, ...args),
          color: this.bot.utils.getColor("success"),
        },
        true
      ).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandMessage:success]: ` + e);
    }

    return this;
  }

  public async info(message: string, ...args: string[]): Promise<CommandMessage> {
    try {
      await this.send(
        {
          description: this.translate(message, ...args),
          color: this.bot.utils.getColor("default"),
        },
        true
      ).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandMessage:info]: ` + e);
    }

    return this;
  }

  async delete(): Promise<CommandMessage> {
    try {
      await this.interaction.deleteOriginalMessage().catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandMessage:delete]: ` + e);
    }
    return this;
  }

  async edit(payload: InteractionContentEdit): Promise<CommandMessage> {
    try {
      await this.interaction.editOriginalMessage(payload).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandMessage:edit]: ` + e);
    }
    return this;
  }

  async continue(ephemeral = true): Promise<CommandMessage> {
    try {
      await this.interaction.defer(ephemeral ? 64 : 0).catch(this.logger.error);
    } catch (e) {
      this.logger.error(`[Core:CommandMessage:continue]: ` + e);
    }

    return this;
  }
}

export default CommandMessage;
