import { ApplicationCommandOptionData, GuildMember } from "discord.js";

export interface DatabaseConfig {
  host: string;
  port: number;
  password: string;
}

export interface MongoConfig extends DatabaseConfig {
  username: string;
  uri: string;
}

export type RedisConfig = DatabaseConfig;

export interface BotConfig {
  token: string;
  mongo: MongoConfig;
  redis: RedisConfig;
  staffs: string[];
  owners: string[];
  devs: string[];
}

export interface Member extends GuildMember {
  client: Bot;
}

export interface AutocompleteOption {
  name: string;
  value: string;
}

export interface TranslationOptions {
  phrase: string;
  locale: string;
}

export interface CommandOptions {
  name: string;
  description: string;
  dirname: string;
  permissionLevel: string;
  cooldown: number;
  aliases: Array<string>;
  example: string;
  usage: string;
  options: Array<ApplicationCommandOptionData>;
}

export interface HostConfig {
  token: string;
  shardCount: number;
  shardList: number[];
  id: string;
}
