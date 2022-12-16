import { GuildSettings } from "@eazyautodelete/db-client";
import { Member } from "eris";
import Base from "../Base";
import Bot from "../Bot";
import Command from "../Command";

const permLevels = {
  botAdmin: 999,
  botMod: 100,
  serverAdmin: 10,
  serverMod: 5,
  user: 0,
};

class PermissionsManager extends Base {
  constructor(bot: Bot) {
    super(bot);
  }

  private _getPermissionLevel(member: Member, guildConfig: GuildSettings): number {
    if (this.isBotAdmin(member.user.id)) return permLevels["botAdmin"];
    if (this.isBotMod(member.user.id)) return permLevels["botMod"];
    if (this.isServerAdmin(member, guildConfig)) return permLevels["serverAdmin"];
    if (this.isServerMod(member, guildConfig)) return permLevels["serverMod"];
    return permLevels["user"];
  }

  public hasPermsToUseCommand(command: Command, member: Member, guildConfig: GuildSettings): boolean {
    return this._getPermissionLevel(member, guildConfig) >= permLevels[command.permissionLevel];
  }

  public isBotAdmin(userId: string): boolean {
    return this.bot.staff.botAdmins.includes(userId);
  }

  public isBotMod(userId: string): boolean {
    return this.bot.staff.botMods.includes(userId) || this.isBotAdmin(userId);
  }

  public isServerAdmin(member: Member, guildConfig: GuildSettings): boolean {
    return (
      member.roles.some(role => guildConfig.adminroles.includes(role)) ||
      member.permissions.has("administrator") ||
      this.isBotAdmin(member.user.id)
    );
  }

  public isServerMod(member: Member, guildConfig: GuildSettings): boolean {
    return member.roles.some(role => guildConfig.modroles.includes(role)) || this.isBotAdmin(member.user.id);
  }
}

export default PermissionsManager;
