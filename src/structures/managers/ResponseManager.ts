import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
  ModalSubmitInteraction,
} from "discord.js";
import Base from "../Base";
import Bot from "../Bot";
import CommandMessage from "../CommandMessage.js";

class ResponseManager extends Base {
  constructor(bot: Bot) {
    super(bot);
  }

  async send(
    message: CommandMessage | ModalSubmitInteraction | ButtonInteraction | CommandInteraction,
    data: MessageEmbed[],
    ephemeral: boolean = false,
    components: MessageActionRow[] = []
  ): Promise<void> {
    try {
      if (message instanceof CommandMessage) {
        await message.send(data, ephemeral, components).catch(this.logger.error);
        return;
      } else
        message.deferred
          ? await message.editReply({ embeds: data, components: components }).catch(this.logger.error)
          : await message.reply({ embeds: data, ephemeral, components: components }).catch(this.logger.error);
    } catch (e) {
      this.logger.error(e as string);
    }

    return;
  }
}

export default ResponseManager;
