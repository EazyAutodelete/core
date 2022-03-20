import Bot from "../structures/Bot";
import { Permissions } from "discord.js";

export interface GuildMember {
    roles: any;
    id: string;
    client: Bot;
    permissions: Readonly<Permissions>;
    guild: Guild;
};

export interface User {
    id: string;
    tag: string;
    avatar: string;
    username: string;
    bot: Bot;
    banner: string;
};