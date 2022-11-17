import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
  ModalSubmitInteraction,
  SelectMenuInteraction,
} from "discord.js";
import Base from "../Base";
import Bot from "../Bot";
import CommandButton from "../CommandButton";
import CommandMenu from "../CommandMenu";
import CommandMessage from "../CommandMessage.js";
import CommandModal from "../CommandModal";

class ResponseManager extends Base {
  constructor(bot: Bot) {
    super(bot);
  }

  async send(
    message:
      | CommandMessage
      | CommandButton
      | CommandMenu
      | CommandModal
      | CommandInteraction
      | ButtonInteraction
      | SelectMenuInteraction
      | ModalSubmitInteraction,
    data: MessageEmbed[],
    ephemeral = false,
    components: MessageActionRow[] = []
  ): Promise<void> {
    try {
      if (
        message instanceof CommandMessage ||
        message instanceof CommandButton ||
        message instanceof CommandMenu ||
        message instanceof CommandModal
      ) {
        await message.send(data, ephemeral, components).catch(this.logger.error);
        return;
      } else {
        if (message.deferred)
          await message.editReply({ embeds: data, components: components }).catch(this.logger.error);
        else if (message.replied)
          await message.followUp({ embeds: data, ephemeral, components }).catch(this.logger.error);
        else await message.reply({ embeds: data, ephemeral, components }).catch(this.logger.error);
      }
    } catch (e) {
      this.logger.error(e as string);
    }

    return;
  }
}

export default ResponseManager;
