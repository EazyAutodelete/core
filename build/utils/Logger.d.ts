import { Console } from "console";
export default class Logger extends Console {
  constructor();
  info(input: string, type?: string): void;
  error(input: string): void;
  warn(input: string): void;
  date(msTimeStamp?: number): string;
}
