import CommandMessage from "./CommandMessage";
import { ms } from "@eazyautodelete/bot-utils";
import {
  Channel,
  Role,
  User,
  InteractionDataOptions,
  InteractionDataOptionsWithValue,
  InteractionDataOptionsRole,
  InteractionDataOptionsUser,
  InteractionDataOptionsMentionable,
  InteractionDataOptionsString,
  InteractionDataOptionsChannel,
  InteractionDataOptionsBoolean,
  InteractionDataOptionsSubCommand,
  InteractionDataOptionsSubCommandGroup,
} from "eris";
import Bot from "./Bot";

export default class CommandMessageArgs {
  command: string;
  message: CommandMessage;
  options: any[];
  bot: Bot;

  constructor(message: CommandMessage) {
    this.bot = message.bot;
    this.message = message;
    this.options = this.message.interaction.data.options || [];
    this.command = this.getCommand();
  }

  public get(argName: string): string | null {
    const opts =
      this.options.find(x => x.type === 2)?.options.find((x: any) => x.type === 1)?.options ||
      this.options.find(x => x.type === 1)?.options ||
      this.options;

    const value = (<InteractionDataOptionsWithValue>opts.find((x: any) => x.name === argName))?.value;
    return value ? value.toString().replace(/\\n/g, "\n") : null;
  }

  public getCommand(): string {
    return this.message.interaction.data.name;
  }

  public getSubcommand(): string | null {
    return (
      this.options?.find(x => x.type === 1)?.name ||
      (<any>this.options?.find(x => x.type === 2)).options.find((x: any) => x.type === 1).name ||
      null
    );
  }

  public getSubcommandGroup(): string | null {
    return this.options?.find(x => x.type === 2)?.name || null;
  }

  public consume(argName: string): string | null;
  public consume(argNames: string[]): string[] | null[];
  public consume(argName: string | string[]): string | (null | string)[] | null {
    const args = Array.isArray(argName) ? argName.map(x => this.get(x)) : this.get(argName);
    return args;
  }

  public removeCodeblock(text: string): string {
    return text
      .replace(/^`(``)?([a-z]+\n)?/i, "")
      .replace(/`(``)?$/, "")
      .trim();
  }

  public consumeLength(argName: string): number | null {
    const opts =
      this.options.find(x => x.type === 2)?.options.find((x: any) => x.type === 1)?.options ||
      this.options.find(x => x.type === 1)?.options ||
      this.options;

    const lengthString = opts.find((x: any) => x.type === 3 && argName === x.name)?.value || null;

    const parsed = lengthString ? ms(lengthString) : null;
    return typeof parsed === "number" ? parsed : null;
  }

  public async consumeChannel(argName: string): Promise<Channel> {
    const opts =
      this.options.find(x => x.type === 2)?.options.find((x: any) => x.type === 1)?.options ||
      this.options.find(x => x.type === 1)?.options ||
      this.options;

    const channelId = opts.find((x: any) => x.type === 7 && argName === x.name)?.value;

    return this.bot.getChannel(channelId);
  }

  public async consumeUser(argName: string): Promise<User> {
    const opts =
      this.options.find(x => x.type === 2)?.options.find((x: any) => x.type === 1)?.options ||
      this.options.find(x => x.type === 1)?.options ||
      this.options;

    const userId = (<InteractionDataOptionsUser | InteractionDataOptionsMentionable>(
      opts.find((x: any) => (x.type === 6 || x.type === 9) && argName === x.name)
    )).value;

    return this.bot.getUser(userId);
  }

  public async consumeRole(argName: string): Promise<Role | undefined> {
    const value = (<InteractionDataOptionsRole>this.options.find(x => x.type === 8 && argName === x.name))?.value;

    return this.bot.getRole(this.message.guildId, value);
  }

  public consumeBoolean(argName: string): boolean {
    return (<InteractionDataOptionsBoolean>this.options.find(x => x.type === 5 && argName === x.name))?.value || false;
  }
}
