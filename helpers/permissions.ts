import { Permissions } from "discord.js";
import { GuildMember } from "../typings";

const permissions = [
    {
        level: 0,
        name: "User",
        check: () => true,
    },
    {
        level: 1,
        name: "Server Team",
        check: (member: GuildMember) => member.roles.cache.get(member.client.database/*INSERT*/),
    },
    {
        level: 2,
        name: "Server Administrator",
        check: (member: GuildMember) => member.permissions.has(Permissions.FLAGS.ADMINISTRATOR),
    },
    {
        level: 3,
        name: "Server Owner",
        check: (member: GuildMember) => member.id === member.guild.ownerId,
    },
    {
        level: 4,
        name: "Bot Staff",
        check: (member: GuildMember) => member.client.config.staffs.includes(member.id)
    },
    {
        level: 5,
        name: "Bot Dev",
        check: (member: GuildMember) => member.client.config.decs.includes(member.id),
    },
    {
        level: 6,
        name: "Bot Owner",
        check: (member: GuildMember) => member.client.config.owners.includes(member.id),
    }
];

export default permissions;