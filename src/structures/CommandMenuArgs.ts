import CommandMenu from "./CommandMenu";

export default class CommandMenuArgs {
  command: string;
  menu: CommandMenu;

  constructor(menu: CommandMenu) {
    this.menu = menu;
    this.command = this.getCommand();
  }

  isCommand(): boolean {
    return this.menu.interaction.customId?.startsWith("cmd_") || false;
  }

  getCommand(): string {
    return this.menu.interaction.customId.split("_")[1] as string;
  }
}
