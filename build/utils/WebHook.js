"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class WebHook {
  constructor(webhook_url) {
    this.url = null;
    this.content = null;
    this.title = null;
    this.description = null;
    this.color = null;
    this.author = {
      name: null,
      url: null,
      icon_url: null,
    };
    this.footer = {
      text: null,
      icon_url: null,
    };
    this.timestamp = null;
    this.webhook_url = webhook_url;
  }
  send() {
    const objBody = {
      content: this === null || this === void 0 ? void 0 : this.content,
      embeds:
        this.description || this.title
          ? [
              {
                title: this.title,
                description: this.description,
                url: this.url,
                color: this.color ? this.color : null,
                author: {
                  name: this.author.name ? this.author.name : null,
                  url: this.author.url ? this.author.url : null,
                  icon_url: this.author.icon_url ? this.author.icon_url : null,
                },
                footer: {
                  text: this.footer.text ? this.footer.text : null,
                  icon_url: this.footer.icon_url ? this.footer.icon_url : null,
                },
                timestamp: this.timestamp ? this.timestamp : null,
              },
            ]
          : [],
    };
    if (!this.webhook_url) throw new SyntaxError("No WebHook URL");
    (0, axios_1.default)({
      method: "post",
      url: this.webhook_url,
      data: JSON.stringify(objBody),
      headers: { "Content-Type": "application/json" },
    });
    return;
  }
  setAuthor(name, icon_url = null, url = null) {
    this.author.name = name;
    this.author.icon_url = icon_url;
    this.author.url = url;
    return this;
  }
  setUrl(url) {
    this.url = url;
    return this;
  }
  setColor(color) {
    this.color = parseInt(color.replace("#", ""), 16);
    if (isNaN(this.color) || !this.color)
      throw new SyntaxError("Invalid Color");
    return this;
  }
  setTitle(text) {
    this.title = text;
    return this;
  }
  setContent(text) {
    this.content = text;
    return this;
  }
  setDescription(text) {
    this.description = text;
    return this;
  }
  setFooter(text, icon_url = null) {
    this.footer.text = text;
    this.footer.icon_url = icon_url;
    return this;
  }
  setTimestamp(timestamp = new Date().getTime()) {
    this.timestamp = new Date(timestamp).toISOString();
    return this;
  }
}
exports.default = WebHook;
