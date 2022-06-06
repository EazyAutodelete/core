import Event from "./Event";
import Bot from "./Bot";

export default class ShardEvent extends Event {
  isShardEvent: boolean;
  constructor(name: string, client: Bot) {
    super(name, client);

    this.isShardEvent = true;
  }
}
