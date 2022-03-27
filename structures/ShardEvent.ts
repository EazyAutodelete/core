import Event from "./Event";
import Bot from "./Bot";

/**
 * An Event which will be run by the bot instance.
 */
export default class ShardEvent extends Event {
  constructor(name: string, client: Bot) {
    super(name, client);
  }

  get isShardEvent() {
    return true;
  }
}
