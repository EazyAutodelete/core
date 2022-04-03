"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const images_js_1 = __importDefault(require("./img/images.js"));
const colors_1 = __importDefault(require("./colors/colors"));
const assets = {
  colors: colors_1.default,
  images: images_js_1.default,
  invite: "https://eazyautodelete.xyz/invite/",
  statuspage: "https://status.eazyautodelete.xyz",
  votepage: "https://eazyautodelete.xyz/vote/",
  url: {
    docs: "https://docs.eazyautodelete.xyz",
    statuspage: "https://status.eazyautodelete.xyz",
    invite: "https://eazyautodelete.xyz/invite/",
    discordInvite:
      "https://discord.com/oauth2/authorize?client_id=746453621821931634&permissions=391232&scope=bot%20applications.commands&redirect_uri=https%3A%2F%2Feazyautodelete.xyz%2Freturn&response_type=code",
    statusWebhook:
      "https://discord.com/api/webhooks/923512991020904469/905rpkDlYNpQMjdQrATetQIWuVB9bCzYjcyPpsS4aoIEoy9_iAAueUrugGdbBixfGvz7",
    messageWebhook:
      "https://discord.com/api/webhooks/925696339583574027/0q9Rxe9yPf9KWYYEOp5AGtBV_oEhzM4oF6OKcxKq8ghI-WngtT7zkbt8JzFrsccnYIqn",
    website: "https://eazyautodelete.xyz/",
    logs: {
      guilds:
        "https://discord.com/api/webhooks/924720345867493446/m1bkFQcWyF2zA4n_5N9DB6fQP3THXTh0RbSPusHN_0RMg3m59rG4umskM5OfdUDATK3j",
      channels:
        "https://discord.com/api/webhooks/924720464536940594/OTKLNui2phTEZjIAl3pZA5f7HOq4zckI3JX9XaPSsdOJILzo6ntBlV-uj8M_X73zG0gQ",
      actions:
        "https://discord.com/api/webhooks/939212244372299846/5JNK6BHeKOuxZ8SPoRQC9HMn4I1UTek_iWbJ-gdX_2pNoL3Nm4cj6LR1-7Jvm3JdNvcv",
    },
  },
};
exports.default = assets;
