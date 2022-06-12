import Discord from "discord.js";
import CommandMessage from "./CommandMessage.js";
import { ms } from "@eazyautodelete/bot-utils";

export default class CommandArgs {
  command: string;
  message: CommandMessage;

  constructor(message: CommandMessage) {
    this.message = message;
    this.command = this.getCommand();
  }

  get(argName: string): string | null {
    const value = this.message.message.options.get(argName);
    return value ? value.toString().replace(/\\n/g, "\n") : null;
  }

  getCommand(): string {
    return this.message.message.commandName;
  }

  getSubcommand(): string | null {
    return this.message.message.options.getSubcommand() || null;
  }

  getSubcommandGroup(): string | null {
    return this.message.message.options.getSubcommandGroup() || null;
  }

  checkSubcommand(compareTo: string): boolean {
    return this.getSubcommand() === compareTo;
  }

  checkSubcommandGroup(compareTo: string): boolean {
    return this.getSubcommandGroup() === compareTo;
  }

  consume(argName: string): string | null;
  consume(argNames: string[]): string[] | null[];
  consume(argName: string | string[]): string | (null | string)[] | null {
    const args = Array.isArray(argName)
      ? argName.map(x => this.get(x))
      : this.get(argName);
    return args;
  }

  removeCodeblock(text: string): string {
    return text
      .replace(/^`(``)?([a-z]+\n)?/i, "")
      .replace(/`(``)?$/, "")
      .trim();
  }

  consumeLength(argName: string): number | null {
    const lengthString = this.message.message.options.getString(argName);

    const parsed = lengthString ? ms(lengthString) : null;
    return typeof parsed === "number" ? parsed : null;
  }

  consumeChannel(argName: string): Discord.Channel | null {
    return this.message.message.options.getChannel(argName) as Discord.Channel;
  }

  consumeUser(argName: string): Discord.User | null {
    return this.message.message.options.getUser(argName) as Discord.User;
  }

  consumeRole(argName: string): Discord.Role | null {
    return this.message.message.options.getRole(argName) as Discord.Role;
  }

  consumeAttachment(
    argName: string,
    check?: (attachment: Discord.MessageAttachment) => boolean
  ): Discord.MessageAttachment | null {
    const attachment = this.message.message.options.getAttachment(argName);
    if (attachment && (!check || check(attachment))) return attachment;
    return null;
  }

  consumeBoolean(argName: string): boolean {
    return this.message.message.options.getBoolean(argName) || false;
  }
}
