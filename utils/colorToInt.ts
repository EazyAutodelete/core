import { ColorResolvable } from "discord.js";

export default function (hex: ColorResolvable): number {
  return parseInt(hex as string, 16);
}
