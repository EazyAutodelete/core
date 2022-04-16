import { APIGuild, APIMessage, APIUser } from "discord-api-types/v10";
import {
  Collection,
  Guild,
  Message,
  Client,
  GuildMember,
  Serialized,
  ShardClientUtil,
  Awaitable,
} from "discord.js";
import Command from "./Command";
import { BotConfig, DatabaseHandler } from "../typings/index";
import Logger from "../utils/Logger";
import colors from "../constants/assets/colors/colors";
import assets from "../constants/assets/assets";
import emojis from "../constants/emojis/emojis";
import i18n from "i18n";
export interface CustomShardUtil extends ShardClientUtil {
  broadcastEval<T>(fn: (client: Bot) => Awaitable<T>): Promise<Serialized<T>[]>;
  broadcastEval<T>(
    fn: (client: Bot) => Awaitable<T>,
    options: {
      shard: number;
    }
  ): Promise<Serialized<T>>;
  broadcastEval<T, P>(
    fn: (client: Bot, context: Serialized<P>) => Awaitable<T>,
    options: {
      context: P;
    }
  ): Promise<Serialized<T>[]>;
  broadcastEval<T, P>(
    fn: (client: Bot, context: Serialized<P>) => Awaitable<T>,
    options: {
      context: P;
      shard: number;
    }
  ): Promise<Serialized<T>>;
}
export default class Bot extends Client {
  config: BotConfig;
  wait: <T = void>(
    delay?: number | undefined,
    value?: T | undefined,
    options?: import("timers").TimerOptions | undefined
  ) => Promise<T>;
  allShardsReady: boolean;
  customEmojis: typeof emojis;
  startedAt: Date;
  startedAtString: string;
  activeEvents: string[];
  eventLog: string;
  shard: CustomShardUtil | null;
  stats: {
    commandsRan: number;
  };
  cooldownUsers: Collection<string, number>;
  commands: Collection<string, Command>;
  disabledCommands: Map<string, string>;
  ready: boolean;
  Logger: Logger;
  logger: Logger;
  loggedActions: {
    messages: Map<string, Message>;
    commands: Map<string, number>;
  };
  database: DatabaseHandler;
  activeChannels: string[];
  checkedChannels: string[];
  filters: {
    FLAGS: {
      PINNED: string;
      NOT_PINNED: string;
      REGEX: string;
      NOT_REGEX: string;
      ALL: string;
      WITH_LINK: string;
      WITHOUT_LINK: string;
      WITH_EMOJIS: string;
      WITHOUT_EMOJIS: string;
      WITH_ATTACHMENT: string;
      WITHOUT_ATTACHMENT: string;
      USAGE_ALL: string;
      USAGE_ONE: string;
    };
  };
  eventLogPath: string;
  assets: typeof assets;
  colors: typeof colors;
  Translator: i18n.I18n;
  locales: string[];
  translate: {
    (
      phraseOrOptions: string | i18n.TranslateOptions,
      ...replace: string[]
    ): string;
    (
      phraseOrOptions: string | i18n.TranslateOptions,
      replacements: i18n.Replacements
    ): string;
  };
  constructor(
    config: BotConfig,
    Database: DatabaseHandler,
    Translator: i18n.I18n
  );
  logEvent(eventName: string): void;
  filterMessages(
    messages: Message[] | APIMessage[],
    filters: string[],
    filterUsage: string,
    regex: RegExp
  ): Collection<string, Message | APIMessage>;
  logAction(action: string, duration: number): boolean;
  modeToString(mode: number): string;
  filterToString(filter: number): string;
  filterUsageToString(filterUsage: string): string;
  bulkDelete(
    channel: string,
    messages: Collection<string, Message | APIMessage>
  ): Promise<void | string[]>;
  createDeleteLog(
    channelId: string,
    messages: Collection<string, Message>
  ): void;
  parseDuration(duration: number): string;
  parseDate(timestamp: number): string;
  clientValue(value: string): Promise<string | void>;
  sendShardWebhook(message: string): void;
  sendGuildWebhook(message: string): void;
  shardEval(
    input: <T>(client: Client<boolean>) => Promise<Serialized<T>[]>
  ): Promise<void | Record<string, unknown>[][] | undefined>;
  resolveMember(search: string, guild: Guild): Promise<GuildMember | void>;
  getApiGuild(id: string): Promise<APIGuild>;
  getApiUser(id: string): Promise<APIUser | void>;
  registerEvents(client: Bot, dir?: string): Promise<void>;
  registerCommands(client: Bot, dir?: string): Promise<void>;
}
