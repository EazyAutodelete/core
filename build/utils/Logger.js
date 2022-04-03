"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const chalk_1 = __importDefault(require("chalk"));
class Logger extends console_1.Console {
  constructor() {
    super(process.stdout, process.stderr);
  }
  info(input, type = "INFO") {
    if (type === "BLANK") {
      return this.log(chalk_1.default.hidden("-"));
    }
    const mess =
      chalk_1.default.bold.cyan(this.date() + " - [ " + type + " ] => ") +
      input;
    super.log(mess);
  }
  error(input) {
    const mess =
      chalk_1.default.bold.redBright(this.date() + " - [ ERR- ] => ") + input;
    super.error(mess);
  }
  warn(input) {
    const mess =
      chalk_1.default.bold.yellow(this.date() + " - [ WARN ] => ") + input;
    super.warn(mess);
  }
  date(msTimeStamp = new Date().getTime()) {
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
exports.default = Logger;
