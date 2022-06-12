import {
  ApplicationCommandOptionData,
  MessageEmbed,
  MessageEmbedOptions,
} from "discord.js";

export { default as Bot } from "./structures/Bot";
export { default as ButtonArgs } from "./structures/ButtonArgs";
export { default as CommandArgs } from "./structures/CommandArgs";
export { default as Command } from "./structures/Command";
export { default as CommandMessage } from "./structures/CommandMessage";
export { default as CommandResponseHandler } from "./structures/discord/CommandResponseHandler";
export { default as Logger } from "./structures/Logger";
export { default as Event } from "./structures/Event";
export { default as ShardEvent } from "./structures/ShardEvent";
export { default as WebHook } from "./structures/WebHook";

export { default as commandDeployer } from "./helpers/commandDeployer";

// config
export interface BotConfig {
  token: string;
  staffs: string[];
  owners: string[];
  devs: string[];
  sharding: Record<string, HostConfig>;
  redis: RedisHandlerConfig;
  mongo: MongoHandlerConfig;
}

export interface HostConfig {
  token: string;
  shardCount: number;
  shardList: number[];
  id: string;
}

export interface MongoHandlerConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  uri: string;
}

export interface RedisHandlerConfig {
  host: string;
  port: number;
  password: string;
}

// commands
export interface CommandOptions {
  name: string;
  description: string;
  dirname: string;
  permissionLevel: PermissionLevel;
  cooldown: Cooldown;
  aliases: string[];
  example: string;
  usage: string;
  options: ApplicationCommandOptionData[];
  botPermissions: bigint[];
}

export interface CommandConfig {
  options: ApplicationCommandOptionData[];
  name: string;
  description: string;
  cooldown: Cooldown;
  usage: string;
  example: string;
  permissionLevel: PermissionLevel;
  botPermissions: bigint[];
}
export type PermissionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CommandHelp {
  name: string;
  description: string;
  permissionLevel: PermissionLevel;
  cooldown: Cooldown;
  usage: string;
  category: string;
  example: string;
  aliases: string[];
}

export interface CommandData {
  name: string;
  description: string;
  options: Array<ApplicationCommandOptionData>;
}

export type Cooldown =
  | 0
  | 3e3
  | 5e3
  | 1e4
  | 15e3
  | 20e3
  | 25e3
  | 3e4
  | 45e3
  | 6e4
  | 12e4
  | 3e5;

// response
export type ResponseData =
  | string
  | string[]
  | MessageEmbedOptions
  | MessageEmbedOptions[]
  | MessageEmbed
  | MessageEmbed[];
