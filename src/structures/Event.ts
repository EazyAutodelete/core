import Bot from "./Bot";

export default class Event {
  name: string;
  client: Bot;

  constructor(name: string, client: Bot) {
    this.name = name;
    this.client = client;
  }

  async run(client: Bot, arg1: any, arg2: any, arg3: any): Promise<void> {
    return this.client.Logger.warn("Ended up in Event.ts [ " + this.name + " ]");
  }

  getShard(client: Bot): number | undefined {
    return client.shard?.ids?.[0];
  }
}
