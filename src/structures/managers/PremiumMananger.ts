import { AnyGuildChannel, AnyThreadChannel, Guild, GuildChannel, TextChannel } from "eris";
import Base from "../Base";
import Bot from "../Bot";

class PremiumManager extends Base {
  constructor(bot: Bot) {
    super(bot);
  }

  public async isPremium(guild: Guild): Promise<boolean>;
  public async isPremium(channel: GuildChannel | TextChannel | AnyThreadChannel | AnyGuildChannel): Promise<boolean>;
  public async isPremium(channelId: string): Promise<boolean>;
  public async isPremium(
    obj: string | GuildChannel | TextChannel | AnyThreadChannel | AnyGuildChannel | Guild
  ): Promise<boolean> {
    if (typeof obj === "string") {
      const channel = this.client.getChannel(obj) as AnyGuildChannel;
      if (channel) {
        const guildId = channel.guild?.id;
        if (!guildId || typeof guildId !== "string") return false;

        const subs = await this.bot.db.getGuildsActiveSubscriptions(guildId);
        return subs && subs.length >= 1;
      } else {
        const guild = this.client.guilds.get(obj);
        if (!guild || !guild.id) return false;

        const subs = await this.bot.db.getGuildsActiveSubscriptions(guild.id);
        return subs && subs.length >= 1;
      }
    } else {
      let guildId = (<any>obj).guild ? (<any>obj).guild.id : obj.id;
      if (!guildId || typeof guildId !== "string") return false;

      const subs = await this.bot.db.getGuildsActiveSubscriptions(guildId);
      return subs && subs.length >= 1;
    }
  }
}

export default PremiumManager;
