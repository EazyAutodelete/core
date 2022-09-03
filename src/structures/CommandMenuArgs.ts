import CommandButton from "./CommandButton";

export default class CommandMenuArgs {
  command: string;
  button: CommandButton;

  constructor(button: CommandButton) {
    this.button = button;
    this.command = this.getCommand();
  }

  isCommand(): boolean {
    return this.button.interaction.customId?.startsWith("cmd_") || false;
  }

  getCommand(): string {
    return this.button.interaction.customId.split("_")[1] as string;
  }
}
