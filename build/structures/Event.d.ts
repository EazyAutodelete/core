import assets from "../constants/assets/assets";
import colors from "../constants/assets/colors/colors";
import emojis from "../constants/emojis/emojis";
import Bot from "./Bot";
export default class Event {
  name: string;
  client: Bot;
  emojis: typeof emojis;
  colors: typeof colors;
  assets: typeof assets;
  constructor(name: string, client: Bot);
  run(client: Bot, arg1: any, arg2: any, arg3: any): Promise<void>;
  getShard(client: Bot): number | undefined;
}
