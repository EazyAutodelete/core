import Base from "../Base";
import Bot from "../Bot";
import Module from "../Module";

class Dispatcher extends Base {
  events: string[];
  private _listeners: {
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

  registerListener(eventName: string, listener: (...args: any[]) => void, module: Module) {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = this._listeners[eventName] || [];
    }

    // Remove the listener from listeners if it exists, and re-add it
    let index = this._listeners[eventName].findIndex(l => l.module.name === module.name);
    if (index > -1) {
      this.client.removeListener(
        eventName,
        this._listeners[eventName].find(x => x.module.name === module.name)?.listener as any
      );
      this._listeners[eventName].splice(index, 1);
    }

    // re-add listener
    this._listeners[eventName].push({ module: module, listener: listener });

    // Register the bound listener
    this.client.on(eventName, listener.bind(module));
  }

  unregisterListener(event: string, listener: Function) {
    let index = this._listeners[event].findIndex(l => l.listener === listener);
    if (index > -1) this._listeners[event].splice(index, 1);

    this.bot.client.removeListener(event, listener as any);
  }
}

export default Dispatcher;
