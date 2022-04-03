"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const permissions = [
  {
    level: 0,
    name: "User",
    check: () => true,
  },
  {
    level: 1,
    name: "Server Team",
    check: (member) =>
      member.roles.cache.get(member.client.database /*INSERT*/),
  },
  {
    level: 2,
    name: "Server Administrator",
    check: (member) =>
      member.permissions.has(discord_js_1.Permissions.FLAGS.ADMINISTRATOR),
  },
  {
    level: 3,
    name: "Server Owner",
    check: (member) => member.id === member.guild.ownerId,
  },
  {
    level: 4,
    name: "Bot Staff",
    check: (member) => member.client.config.staffs.includes(member.id),
  },
  {
    level: 5,
    name: "Bot Dev",
    check: (member) => member.client.config.devs.includes(member.id),
  },
  {
    level: 6,
    name: "Bot Owner",
    check: (member) => member.client.config.owners.includes(member.id),
  },
];
exports.default = permissions;
