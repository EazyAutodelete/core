import Event from "./Event";
import Bot from "./Bot";

export default class ShardEvent extends Event {
  constructor(name: string, client: Bot) {
    super(name, client);
  }

  get isShardEvent() {
    return true;
  }
}
