import Base from "../Base";
import Bot from "../Bot";
import Module from "../Module";

class Dispatcher extends Base {
  events: string[];
  private _listeners: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: Array<{ module: Module; listener: (...args: any[]) => void }>;
  } = {};
  constructor(bot: Bot) {
    super(bot);

    this._listeners = {};

    this.events = [
      "channelCreate",
      "channelDelete",
      "clientReady",
      "guildBanAdd",
      "guildBanRemove",
      "guildCreate",
      "guildDelete",
      "guildMemberAdd",
      "guildMemberRemove",
      "guildMemberUpdate",
      "guildRoleCreate",
      "guildRoleDelete",
      "guildRoleUpdate",
      "interactionCreate",
      "messageCreate",
      "messageDelete",
      "messageDeleteBulk",
      "messageUpdate",
      "userUpdate",
      "voiceChannelJoin",
      "voiceChannelLeave",
      "voiceChannelSwitch",
      "messageReactionAdd",
      "messageReactionRemove",
      "messageReactionRemoveAll",
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerListener(eventName: string, listener: (...args: any[]) => void, module: Module) {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = this._listeners[eventName] || [];
    }

    // Remove the listener from listeners if it exists, and re-add it
    const index = this._listeners[eventName].findIndex(l => l.module.name === module.name);
    if (index > -1) {
      this.client.removeListener(
        eventName,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._listeners[eventName].find(x => x.module.name === module.name)!.listener
      );
      this._listeners[eventName].splice(index, 1);
    }

    // re-add listener
    this._listeners[eventName].push({ module: module, listener: listener });

    // Register the bound listener
    this.client.on(eventName, listener.bind(module));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unregisterListener(event: string, listener: (...args: any[]) => void) {
    const index = this._listeners[event].findIndex(l => l.listener === listener);
    if (index > -1) this._listeners[event].splice(index, 1);

    this.bot.client.removeListener(event, listener);
  }
}

export default Dispatcher;
