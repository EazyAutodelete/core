"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const assets_js_1 = __importDefault(require("./assets/assets.js"));
const emojis_js_1 = __importDefault(require("./emojis/emojis.js"));
const constants = {
  assets: assets_js_1.default,
  emojis: emojis_js_1.default,
};
exports.default = constants;
