import Bot from "../structures/Bot";
import Command from "../structures/Command";
import Event from "../structures/Event";
import ShardEvent from "../structures/ShardEvent";
import Logger from "../utils/Logger";
import WebHook from "../utils/WebHook";
import constants from "../constants/constants";
import emojis from "../constants/emojis/emojis";
import assets from "../constants/assets/assets";
import colors from "../constants/assets/colors/colors";
import images from "../constants/assets/img/images";
import permissions from "../helpers/permissions";

export default {
  Bot,
  Command,
  Event,
  ShardEvent,
  Logger,
  WebHook,
  constants,
  emojis,
  assets,
  colors,
  images,
  permissions,
};

export { default as Bot } from "../structures/Bot";
export { default as Command } from "../structures/Command";
export { default as Event } from "../structures/Event";
export { default as ShardEvent } from "../structures/ShardEvent";
export { default as Logger } from "../utils/Logger";
export { default as WebHook } from "../utils/WebHook";
