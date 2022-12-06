import { ActionRow, CommandInteraction, ComponentInteraction, Embed, EmbedOptions } from "eris";
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
    message: CommandMessage | CommandButton | CommandMenu | CommandModal | ComponentInteraction | CommandInteraction,
    data: Embed | Embed[] | EmbedOptions | EmbedOptions[],
    ephemeral = false,
    components: ActionRow[] = []
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
        const embeds = (Array.isArray(data) ? data : [data]).map(x => {
          if (typeof x.color === "string") {
            x.color = parseInt(x.color, 16);
          }
          return x;
        });
        message.createMessage({ embeds, components, flags: ephemeral ? 64 : 0 }).catch(this.logger.error);
      }
    } catch (e) {
      this.logger.error(e as string);
    }

    return;
  }
}

export default ResponseManager;
