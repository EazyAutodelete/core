import {
  ApplicationCommandOptionData,
  GuildMember,
  ColorResolvable,
  Awaitable,
  Serialized,
  ShardClientUtil,
} from "discord.js";
import mongoose from "mongoose";

import Bot from "../structures/Bot";
import Command from "../structures/Command";
import Event from "../structures/Event";
import ShardEvent from "../structures/ShardEvent";
import Logger from "../utils/Logger";
import WebHook from "../utils/WebHook";
declare const _default: {
  Bot: typeof Bot;
  Command: typeof Command;
  Event: typeof Event;
  ShardEvent: typeof ShardEvent;
  Logger: typeof Logger;
  WebHook: typeof WebHook;
  constants: {
    assets: {
      colors: {
        error: ColorResolvable;
        succesfull: ColorResolvable;
        default: ColorResolvable;
        partners: {
          serverblaze: ColorResolvable;
        };
      };
      images: {
        avatar: string;
        logo: {
          png: {
            url: string;
          };
          url: string;
        };
        sponsors: {
          serverblaze: {
            logo_light: string;
          };
          uptimerobot: {
            banners: {
              white: string;
              black: string;
            };
            logo: {
              white: string;
            };
          };
        };
      };
      invite: string;
      statuspage: string;
      votepage: string;
      url: {
        docs: string;
        statuspage: string;
        invite: string;
        discordInvite: string;
        statusWebhook: string;
        messageWebhook: string;
        website: string;
        logs: {
          guilds: string;
          channels: string;
          actions: string;
        };
      };
    };
    emojis: {
      error: string;
      succes: string;
      yes: string;
      statusOnline: string;
      loading: string;
      ram: string;
      root: string;
      host: string;
      blank: string;
      nodeJS: string;
      dev: string;
      err: string;
      uptimerobot: string;
      calender: string;
      discord: {
        js: string;
      };
      discordjs: string;
      channel: string;
      members: string;
      verifiedBot: string;
      developer: string;
      admin: string;
      pin: string;
      status: {
        DND: string;
        OFFLINE: string;
        IDLE: string;
        ONLINE: string;
      };
    };
  };
  emojis: {
    error: string;
    succes: string;
    yes: string;
    statusOnline: string;
    loading: string;
    ram: string;
    root: string;
    host: string;
    blank: string;
    nodeJS: string;
    dev: string;
    err: string;
    uptimerobot: string;
    calender: string;
    discord: {
      js: string;
    };
    discordjs: string;
    channel: string;
    members: string;
    verifiedBot: string;
    developer: string;
    admin: string;
    pin: string;
    status: {
      DND: string;
      OFFLINE: string;
      IDLE: string;
      ONLINE: string;
    };
  };
  assets: {
    colors: {
      error: ColorResolvable;
      succesfull: ColorResolvable;
      default: ColorResolvable;
      partners: {
        serverblaze: ColorResolvable;
      };
    };
    images: {
      avatar: string;
      logo: {
        png: {
          url: string;
        };
        url: string;
      };
      sponsors: {
        serverblaze: {
          logo_light: string;
        };
        uptimerobot: {
          banners: {
            white: string;
            black: string;
          };
          logo: {
            white: string;
          };
        };
      };
    };
    invite: string;
    statuspage: string;
    votepage: string;
    url: {
      docs: string;
      statuspage: string;
      invite: string;
      discordInvite: string;
      statusWebhook: string;
      messageWebhook: string;
      website: string;
      logs: {
        guilds: string;
        channels: string;
        actions: string;
      };
    };
  };
  colors: {
    error: ColorResolvable;
    succesfull: ColorResolvable;
    default: ColorResolvable;
    partners: {
      serverblaze: ColorResolvable;
    };
  };
  images: {
    avatar: string;
    logo: {
      png: {
        url: string;
      };
      url: string;
    };
    sponsors: {
      serverblaze: {
        logo_light: string;
      };
      uptimerobot: {
        banners: {
          white: string;
          black: string;
        };
        logo: {
          white: string;
        };
      };
    };
  };
  permissions: (
    | {
        level: number;
        name: string;
        check: (
          member: import("../helpers/permissions").Member
        ) => import("discord.js").Role | undefined;
      }
    | {
        level: number;
        name: string;
        check: (member: import("../helpers/permissions").Member) => boolean;
      }
  )[];
};
export default _default;
export { default as Bot } from "../structures/Bot";
export { default as Command } from "../structures/Command";
export { default as Event } from "../structures/Event";
export { default as ShardEvent } from "../structures/ShardEvent";
export { default as Logger } from "../utils/Logger";
export { default as WebHook } from "../utils/WebHook";

export const channel: mongoose.Model<any, {}, {}, {}>;
export const guild: mongoose.Model<any, {}, {}, {}>;
export const user: mongoose.Model<any, {}, {}, {}>;

export interface CustomTextChannel extends TextChannel {
  settings: ChannelSettings;
  client: Bot;
}

export interface HostConfig {
  token: string;
  shardCount: number;
  shardList: number[];
  id: string;
}

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
  sharding: Record<string, HostConfig>;
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
  permissionLevel: PermissionLevel;
  cooldown: Cooldown;
  aliases: string[];
  example: string;
  usage: string;
  options: ApplicationCommandOptionData[];
  botPermissions: bigint[];
}

export type PermissionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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

export interface CacheMessage {
  id: string;
  channel: string;
  guild: string;
  content: string;
  pinned: boolean;
  attachments: number;
}

export interface CustomShardUtil extends ShardClientUtil {
  broadcastEval<T>(fn: (client: Bot) => Awaitable<T>): Promise<Serialized<T>[]>;
  broadcastEval<T>(
    fn: (client: Bot) => Awaitable<T>,
    options: { shard: number }
  ): Promise<Serialized<T>>;
  broadcastEval<T, P>(
    fn: (client: Bot, context: Serialized<P>) => Awaitable<T>,
    options: { context: P }
  ): Promise<Serialized<T>[]>;
  broadcastEval<T, P>(
    fn: (client: Bot, context: Serialized<P>) => Awaitable<T>,
    options: { context: P; shard: number }
  ): Promise<Serialized<T>>;
}

export class DatabaseHandler {
  connected: boolean;
  Logger: Logger;
  mongo: MongoHandler;
  redis: RedisHandler;
  config: DatabaseHandlerConfig;
  constructor(config: DatabaseHandlerConfig, Logger: Logger);
  connect(): Promise<void>;
  getAllActiveChannels(): Promise<string[]>;
  getUserSettings(userId: string): Promise<UserSettings>;
  createUserSettings(
    userId: string,
    {
      lang,
      registered,
    }?: {
      lang?: string;
      registered?: number;
    }
  ): Promise<UserSettings>;
  deleteUserSettings(userId: string): Promise<void>;
  updateUserSettings(
    userId: string,
    {
      lang,
      registered,
    }?: {
      lang?: string;
      registered?: number;
    }
  ): Promise<UserSettings>;
  deleteUserCache(userId: string): Promise<void>;
  updateUserCache(userId: string): Promise<void>;
  getGuildSettings(guildId: string): Promise<GuildSettings>;
  createGuildSettings(
    guildId: string,
    {
      registered,
      prefix,
      premium,
      adminroles,
      modroles,
    }: {
      registered?: number;
      prefix?: string;
      premium?: boolean;
      adminroles?: Array<string>;
      modroles?: Array<string>;
    }
  ): Promise<GuildSettings>;
  deleteGuildSettings(guildId: string): Promise<void>;
  updateGuildSettings(
    guildId: string,
    {
      registered,
      prefix,
      premium,
      adminroles,
      modroles,
    }?: {
      registered?: number;
      prefix?: string;
      premium?: boolean;
      adminroles?: Array<string>;
      modroles?: Array<string>;
    }
  ): Promise<GuildSettings>;
  deleteGuildCache(guildId: string): Promise<void>;
  updateGuildCache(guildId: string): Promise<void>;
  getChannelSettings(
    channelId: string,
    guild: string
  ): Promise<ChannelSettings>;
  createChannelSettings(
    channelId: string,
    guild: string,
    {
      registered,
      limit,
      mode,
      ignore,
      filters,
      regex,
      filterUsage,
    }?: {
      registered?: number;
      limit?: number;
      mode?: number;
      ignore?: Array<string>;
      filters?: Array<number>;
      regex?: RegExp | null;
      filterUsage?: string;
    }
  ): Promise<ChannelSettings>;
  deleteChannelSettings(channelId: string): Promise<void>;
  updateChannelSettings(
    channelId: string,
    guild: string,
    {
      registered,
      limit,
      mode,
      ignore,
      filters,
      regex,
      filterUsage,
    }: {
      registered?: number;
      limit?: number;
      mode?: number;
      ignore?: Array<string>;
      filters?: Array<number>;
      regex?: RegExp | null;
      filterUsage?: string;
    }
  ): Promise<ChannelSettings>;
  deleteChannelCache(channelId: string): Promise<void>;
  updateChannelCache(channelId: string, guild: string): Promise<void>;
}

export class RedisHandler {
  config: RedisHandlerConfig;
  redis: Redis;
  Logger: Logger;
  constructor(config: RedisHandlerConfig, Logger: Logger);
  connect(): Promise<void>;
  getKey(key: string): Promise<string | null>;
  getHashfields(key: string): Promise<Record<string, string>>;
  setHash(
    key: string,
    data: UserSettings | ChannelSettings | GuildSettings | any
  ): Promise<void>;
  deleteKey(key: string): Promise<void>;
}

export class MongoHandler {
  mongo: typeof mongoose;
  config: MongoHandlerConfig;
  Logger: Logger;
  guild: typeof guild;
  channel: typeof channel;
  user: typeof user;
  constructor(config: MongoHandlerConfig, Logger: Logger);
  connect(): Promise<void>;
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(
    userId: string,
    {
      lang,
      registered,
    }?: {
      lang?: string;
      registered?: number;
    }
  ): Promise<UserSettings>;
  deleteUserSettings(userId: string): Promise<void>;
  getGuildSettings(guildId: string): Promise<GuildSettings | undefined>;
  createGuildSettings(
    guildId: string,
    {
      registered,
      prefix,
      premium,
      adminroles,
      modroles,
    }?: {
      registered?: number;
      prefix?: string;
      premium?: boolean;
      adminroles?: Array<string>;
      modroles?: Array<string>;
    }
  ): Promise<GuildSettings>;
  deleteGuildSettings(guildId: string): Promise<void>;
  getChannelSettings(channelId: string): Promise<ChannelSettings | undefined>;
  createChannelSettings(
    channelId: string,
    guild: string,
    {
      registered,
      limit,
      mode,
      ignore,
      filters,
      regex,
      filterUsage,
    }?: {
      registered?: number;
      limit?: number;
      mode?: number;
      ignore?: Array<string>;
      filters?: Array<number>;
      regex?: RegExp | null;
      filterUsage?: string;
    }
  ): Promise<ChannelSettings>;
  deleteChannelSettings(channelId: string): Promise<void>;
}

export interface DatabaseHandlerConfig {
  redis: RedisHandlerConfig;
  mongo: MongoHandlerConfig;
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

export interface UserSettings {
  id: string;
  registered: number;
  language: string;
}

export interface ChannelSettings {
  id: string;
  guild: string;
  registered: number;
  limit: number;
  mode: number;
  ignore: Array<string>;
  filters: Array<number>;
  regex: null | RegExp;
  filterUsage: string;
}

export interface GuildSettings {
  id: string;
  prefix: string;
  registered: number;
  premium: boolean;
  adminroles: Array<string>;
  modroles: Array<string>;
}

export type UserSettingsLanguage = string;
/**
                                        "en"    |   // English 
                                        "bg"    |   // Bulgarian
                                        "hr"    |   // Croatian
                                        "cs"    |   // Czech
                                        "da"    |   // Danish 
                                        "nl"    |   // Dutch
                                        "fi"    |   // Finnish
                                        "fr"    |   // French
                                        "de"    |   // German
                                        "el"    |   // Greek
                                        "hi"    |   // Hindi
                                        "hu"    |   // Hungarian
                                        "it"    |   // Italian
                                        "ja"    |   // Japanese
                                        "ko"    |   // Korean
                                        "lt"    |   // Lithuanian
                                        "no"    |   // Norwegian
                                        "pl"    |   // Polish
                                        "pt"    |   // Portuguese
                                        "ro"    |   // Romanian
                                        "ru"    |   // Russian
                                        "es"    |   // Spanish 
                                        "sv-SE" |   // Swedish
                                        "th"    |   // Thai
                                        "tr"    |   // Turkish
                                        "uk"    |   // Ukrainian
                                        "vi";       // Vietnamese*/

export type FilterType = number; // 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type FilterUsage = string; //"all" | "one"

export type ModeType = number; //0 | 1 | 2 | 3 | 4;
