import { Permissions, GuildMember } from "discord.js";
import Bot from "../structures/Bot";

export interface Member extends GuildMember {
  client: Bot;
}

const permissions = [
  {
    level: 0,
    name: "User",
    check: () => true,
  },
  {
    level: 1,
    name: "Server Team",
    check: (member: Member) =>
      member.roles.cache.get(member.client.database /*INSERT*/),
  },
  {
    level: 2,
    name: "Server Administrator",
    check: (member: Member) =>
      member.permissions.has(Permissions.FLAGS.ADMINISTRATOR),
  },
  {
    level: 3,
    name: "Server Owner",
    check: (member: Member) => member.id === member.guild.ownerId,
  },
  {
    level: 4,
    name: "Bot Staff",
    check: (member: Member) => member.client.config.staffs.includes(member.id),
  },
  {
    level: 5,
    name: "Bot Dev",
    check: (member: Member) => member.client.config.devs.includes(member.id),
  },
  {
    level: 6,
    name: "Bot Owner",
    check: (member: Member) => member.client.config.owners.includes(member.id),
  },
];

export default permissions;
