import { GuildMember } from "discord.js";
import Bot from "../structures/Bot";
export interface Member extends GuildMember {
  client: Bot;
}
declare const permissions: (
  | {
      level: number;
      name: string;
      check: (member: Member) => import("discord.js").Role | undefined;
    }
  | {
      level: number;
      name: string;
      check: (member: Member) => boolean;
    }
)[];
export default permissions;
