import CommandButton from "./CommandButton";

export default class CommandButtonArgs {
  command: string;
  button: CommandButton;

  constructor(button: CommandButton) {
    this.button = button;
    this.command = this.getCommand();
  }

  isCommand(): boolean {
    return this.button.interaction.data.custom_id.startsWith("cmd_") || false;
  }

  getCommand(): string {
    return this.button.interaction.data.custom_id.split("_")[1];
  }
}
