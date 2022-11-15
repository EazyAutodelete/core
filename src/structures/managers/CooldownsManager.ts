import Base from "../Base";
import Bot from "../Bot";

class CooldownsManager extends Base {
  private _cooldowns: Map<string, { [index: string]: number }>;
  constructor(bot: Bot) {
    super(bot);

    this._cooldowns = new Map();

    setInterval(() => this._updateCooldowns(), 200);
  }

  public hasCooldown(commandName: string, user: string): number {
    if (!this._cooldowns.get(commandName)?.[user]) return 0;

    return this._remainingCooldown(commandName, user);
  }

  public setCooldown(commandName: string, user: string): void {
    this._cooldowns.set(commandName, {
      ...this._cooldowns.get(commandName),
      [user]: this._now() + this.bot.commands.get(commandName)?.cooldown ?? 0,
    });
  }

  private _now(): number {
    return Date.now();
  }

  private _updateCooldowns(): void {
    for (const [command, users] of this._cooldowns) {
      for (const [user, cooldown] of Object.entries(users)) {
        if (cooldown < this._now()) {
          delete this._cooldowns.get(command)?.[user];
        }
      }
    }
  }

  private _remainingCooldown(commandName: string, user: string): number {
    const remainingCooldown = (this._cooldowns.get(commandName)?.[user] || 0) - this._now();
    return remainingCooldown < 0 ? 0 : remainingCooldown;
  }
}

export default CooldownsManager;
