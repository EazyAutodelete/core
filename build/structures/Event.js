"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("../constants/constants"));
class Event {
  constructor(name, client) {
    this.name = name;
    this.assets = constants_1.default.assets;
    this.colors = constants_1.default.assets.colors;
    this.emojis = constants_1.default.emojis;
    this.client = client;
  }
  run(client, arg1, arg2, arg3) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.client.Logger.warn(
        "Ended up in Event.ts [ " + this.name + " ]"
      );
    });
  }
  getShard(client) {
    var _a, _b;
    return (_b =
      (_a = client.shard) === null || _a === void 0 ? void 0 : _a.ids) ===
      null || _b === void 0
      ? void 0
      : _b[0];
  }
}
exports.default = Event;
