import assets from "../constants/assets/assets";
import colors from "../constants/assets/colors/colors";
import constants from "../constants/constants";
import emojis from "../constants/emojis/emojis";
import Bot from "./Bot";

export default class Event {
  name: string;
  client: Bot;
  emojis: typeof emojis;
  colors: typeof colors;
  assets: typeof assets;

  constructor(name: string, client: Bot) {
    this.name = name;
    this.assets = constants.assets;
    this.colors = constants.assets.colors;
    this.emojis = constants.emojis;
    this.client = client;
  }

  async run(client: Bot) {
    client.logger.warn("Base Event");
  }

  getShard(client: Bot): number {
    return client.shard.ids?.[0];
  }
}
