import CommandModal from "./CommandModal";

export default class ButtonArgs {
  command: string;
  modal: CommandModal;

  constructor(modal: CommandModal) {
    this.modal = modal;
    this.command = this.getCommand();
  }

  isCommand(): boolean {
    return this.modal.interaction.customId?.startsWith("cmd_") || false;
  }

  getCommand(): string {
    return this.modal.interaction.customId.split("_")[1] as string;
  }
}
