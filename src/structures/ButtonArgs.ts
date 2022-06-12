import CommandButton from "./CommandButton";

export default class ButtonArgs {
  command: string;
  button: CommandButton;

  constructor(button: CommandButton) {
    this.button = button;
    this.command = this.getCommand();
  }

  getCommand(): string {
    return this.button.interaction.customId.split("_")[1] as string;
  }
}
