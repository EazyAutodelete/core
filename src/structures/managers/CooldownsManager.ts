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
    if (!this._cooldowns.has(commandName) || !this._cooldowns.get(commandName)![user]) {
      return 0;
    }
    return this._remainingCooldown(commandName, user);
  }

  public setCooldown(commandName: string, user: string): void {
    if (!this._cooldowns.has(commandName)) {
      this._cooldowns.set(commandName, {});
    }

    this._cooldowns.get(commandName)![user] = this._now() + this.bot.commands.get(commandName)!.cooldown;
  }

  private _now(): number {
    return Date.now();
  }

  private _updateCooldowns(): void {
    for (const [command, users] of this._cooldowns) {
      for (const [user, cooldown] of Object.entries(users)) {
        if (cooldown < this._now()) {
          delete this._cooldowns.get(command)![user];
        }
      }
    }
  }

  private _remainingCooldown(commandName: string, user: string): number {
    let remainingCooldown = this._cooldowns.get(commandName)![user] - this._now();
    return remainingCooldown < 0 ? 0 : remainingCooldown;
  }
}

export default CooldownsManager;
