import { APIGuild, APIMessage, APIUser } from "discord-api-types/v10";
import {
  Collection,
  Guild,
  Message,
  Client,
  GuildMember,
  Serialized,
  ShardClientUtil,
} from "discord.js";
import DatabaseHandler from "@eazyautodelete/eazyautodelete-db-client";
import Command from "./Command";
import { BotConfig } from "../typings/index";
import {
  translate,
  Translator,
  locales,
} from "@eazyautodelete/eazyautodelete-lang";
import Logger from "../utils/Logger";
import colors from "../constants/assets/colors/colors";
import assets from "../constants/assets/assets";
import emojis from "../constants/emojis/emojis";
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
  shard: ShardClientUtil | null;
  stats: {
    commandsRan: number;
  };
  locales: locales;
  Translator: Translator;
  translate: translate;
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
  constructor(config: BotConfig);
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
  registerEvents(dir?: string): Promise<void>;
  registerCommands(dir?: string): Promise<void>;
}
