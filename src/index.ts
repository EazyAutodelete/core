// config
export type Cooldown = 0 | 3e3 | 5e3 | 1e4 | 15e3 | 20e3 | 25e3 | 3e4 | 45e3 | 6e4 | 12e4 | 3e5;
export type PermissionLevel = "botAdmin" | "botMod" | "serverAdmin" | "serverMod" | "user";

export { default as Base } from "./structures/Base";
export { default as Bot } from "./structures/Bot";
export { default as Command } from "./structures/Command";
export { default as CommandArgs } from "./structures/CommandArgs";
export { default as CommandButton } from "./structures/CommandButton";
export { default as CommandButtonArgs } from "./structures/CommandButtonArgs";
export { default as CommandMessage } from "./structures/CommandMessage";
export { default as Logger } from "./structures/Logger";
export { default as Module } from "./structures/Module";
export { default as WebHook } from "./structures/WebHook";

export interface BotOptions {
  token: string;
  staffServer: string;
  supportServer: string;
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
  sharding?: {
    shardCount?: number;
    shardList?: number[];
    id?: number;
  };
  staff?: {
    botAdmins?: string[];
    botMods?: string[];
  };
}
