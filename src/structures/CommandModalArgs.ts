import CommandModal from "./CommandModal";

export default class CommandModalArgs {
  command: string;
  modal: CommandModal;

  constructor(modal: CommandModal) {
    this.modal = modal;
    this.command = this.getCommand();
  }

  isCommand(): boolean {
    return this.modal.interaction.data.custom_id.startsWith("cmd_") || false;
  }

  getCommand(): string {
    return this.modal.interaction.data.custom_id.split("_")[1];
  }
}
