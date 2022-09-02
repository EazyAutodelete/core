import { Console } from "console";
import chalk from "chalk";
import Bot from "./Bot";

export default class Logger extends Console {
  constructor() {
    super(process.stdout, process.stderr);
  }

  info(input: string, type = "INFO"): void {
    if (type === "BLANK") {
      return this.log(chalk.hidden("-"));
    }
    const mess = chalk.cyan("[INFO]" + (type ? "[" + type + "]" : "")) + ": " + input;
    super.log(mess);
  }

  error(input: string, type?: string): void {
    const mess = chalk.bold.redBright("[ERRO]" + (type ? "[" + type + "]" : "")) + ": " + input;
    super.error(mess);
  }

  warn(input: string, type?: string): void {
    const mess = chalk.bold.yellow("[WARN]" + (type ? "[" + type + "]" : "")) + ": " + input;
    super.warn(mess);
  }

  date(msTimeStamp: number = new Date().getTime()): string {
    const date = new Date(msTimeStamp);

    let minutes = `${date.getMinutes()}`;
    if (minutes.length === 1) minutes = `0${minutes}`;

    let seconds = `${date.getSeconds()}`;
    if (seconds.length === 1) seconds = `0${seconds}`;

    return `[ ${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()} - ${date.getHours()}:${minutes}:${seconds} ]`;
  }
}
