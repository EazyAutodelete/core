"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebHook =
  exports.Logger =
  exports.ShardEvent =
  exports.Event =
  exports.Command =
  exports.Bot =
    void 0;
const Bot_1 = __importDefault(require("../structures/Bot"));
const Command_1 = __importDefault(require("../structures/Command"));
const Event_1 = __importDefault(require("../structures/Event"));
const ShardEvent_1 = __importDefault(require("../structures/ShardEvent"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const WebHook_1 = __importDefault(require("../utils/WebHook"));
const constants_1 = __importDefault(require("../constants/constants"));
const emojis_1 = __importDefault(require("../constants/emojis/emojis"));
const assets_1 = __importDefault(require("../constants/assets/assets"));
const colors_1 = __importDefault(require("../constants/assets/colors/colors"));
const images_1 = __importDefault(require("../constants/assets/img/images"));
const permissions_1 = __importDefault(require("../helpers/permissions"));
exports.default = {
  Bot: Bot_1.default,
  Command: Command_1.default,
  Event: Event_1.default,
  ShardEvent: ShardEvent_1.default,
  Logger: Logger_1.default,
  WebHook: WebHook_1.default,
  constants: constants_1.default,
  emojis: emojis_1.default,
  assets: assets_1.default,
  colors: colors_1.default,
  images: images_1.default,
  permissions: permissions_1.default,
};
var Bot_2 = require("../structures/Bot");
Object.defineProperty(exports, "Bot", {
  enumerable: true,
  get: function () {
    return __importDefault(Bot_2).default;
  },
});
var Command_2 = require("../structures/Command");
Object.defineProperty(exports, "Command", {
  enumerable: true,
  get: function () {
    return __importDefault(Command_2).default;
  },
});
var Event_2 = require("../structures/Event");
Object.defineProperty(exports, "Event", {
  enumerable: true,
  get: function () {
    return __importDefault(Event_2).default;
  },
});
var ShardEvent_2 = require("../structures/ShardEvent");
Object.defineProperty(exports, "ShardEvent", {
  enumerable: true,
  get: function () {
    return __importDefault(ShardEvent_2).default;
  },
});
var Logger_2 = require("../utils/Logger");
Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function () {
    return __importDefault(Logger_2).default;
  },
});
var WebHook_2 = require("../utils/WebHook");
Object.defineProperty(exports, "WebHook", {
  enumerable: true,
  get: function () {
    return __importDefault(WebHook_2).default;
  },
});
