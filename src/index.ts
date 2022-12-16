export type Cooldown = 0 | 3e3 | 5e3 | 1e4 | 15e3 | 20e3 | 25e3 | 3e4 | 45e3 | 6e4 | 12e4 | 3e5;
export type PermissionLevel = "botAdmin" | "botMod" | "serverAdmin" | "serverMod" | "user";

export { default as Base } from "./structures/Base";
export { default as Bot } from "./structures/Bot";
export { default as Command } from "./structures/Command";

export { default as CommandMessage } from "./structures/CommandMessage";
export { default as CommandMessageArgs } from "./structures/CommandMessageArgs";

export { default as CommandButton } from "./structures/CommandButton";
export { default as CommandButtonArgs } from "./structures/CommandButtonArgs";

export { default as CommandModal } from "./structures/CommandModal";
export { default as CommandModalArgs } from "./structures/CommandModalArgs";

export { default as CommandMenu } from "./structures/CommandMenu";
export { default as CommandMenuArgs } from "./structures/CommandMenuArgs";

export { default as Module } from "./structures/Module";
export { default as WebHook } from "./structures/WebHook";

export interface BotOptions {
  token: string;
  staffServer: string;
  supportServer: string;
  weblate_token: string;
  mongo: {
    uri: string;
    host: string;
    port: number;
    username: string;
    password: string;
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
  sharding: {
    shardCount: number;
    shardList: number[];
    id: number;
    firstShardID: number;
    lastShardID: number;
    maxShards: number;
  };
  staff?: {
    botAdmins?: string[];
    botMods?: string[];
  };
  performance: {
    cache: {
      messageCacheMaxSize: number;
    };
    disableEvents: string[];
  };
  gateway: {
    intents: string[];
  };
}
