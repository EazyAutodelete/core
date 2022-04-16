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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Command {
  constructor(
    client,
    {
      name = "",
      description = "",
      dirname = __dirname,
      permissionLevel = 1,
      cooldown = 5000,
      aliases = [],
      example = "",
      usage = "",
      options = [],
    }
  ) {
    this.client = client;
    this.config = {
      options,
      name,
      description,
      cooldown,
      usage,
      example,
      permissionLevel,
    };
    this.help = {
      name,
      description,
      permissionLevel,
      cooldown,
      category: dirname.split("\\")[dirname.split("\\").length - 1],
      usage,
      example,
      aliases,
    };
    this.data = {
      name: this.help.name,
      description: this.help.description,
      options: this.config.options,
    };
    this.assets = this.client.assets;
    this.colors = this.assets.colors;
    this.emojis = this.client.customEmojis;
    this.Logger = client === null || client === void 0 ? void 0 : client.Logger;
    this.reply = this.response;
  }
  docsButton(url) {
    return new discord_js_1.MessageActionRow().addComponents([
      new discord_js_1.MessageButton()
        .setDisabled(false)
        .setEmoji("❓")
        .setLabel("Help")
        .setStyle("LINK")
        .setURL(url),
    ]);
  }
  run(client, interaction) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      return this.Logger.warn(
        "Ended up in command.js [ " +
          this.config +
          " - " +
          ((_a = interaction.guild) === null || _a === void 0
            ? void 0
            : _a.id) +
          " - " +
          ((_b = interaction.channel) === null || _b === void 0
            ? void 0
            : _b.id) +
          " ]"
      );
    });
  }
  autocompleteHandler(query) {
    this.Logger.warn(
      "Ended up in command.js [ " + this.config + " - " + query + " ]"
    );
    return [];
  }
  selectMenuHandler(interaction) {
    this.Logger.warn(
      "Ended up in command.js [ " + this.config + " - " + interaction.id + " ]"
    );
    return;
  }
  response(interaction, input, ephemeral, components) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof input === "string") {
        return yield interaction
          .reply({
            content: input,
            ephemeral: ephemeral,
            components: (
              components === null || components === void 0
                ? void 0
                : components.components
            )
              ? [components]
              : [],
          })
          .catch(this.client.Logger.error);
      } else if (Array.isArray(input)) {
        return yield interaction
          .reply({
            embeds: input,
            ephemeral: ephemeral,
            components: (
              components === null || components === void 0
                ? void 0
                : components.components
            )
              ? [components]
              : [],
          })
          .catch(this.client.Logger.error);
      } else if (input.description || input.title) {
        return yield interaction
          .reply({
            embeds: [input],
            ephemeral: ephemeral,
            components: (
              components === null || components === void 0
                ? void 0
                : components.components
            )
              ? [components]
              : [],
          })
          .catch(this.client.Logger.error);
      }
    });
  }
  error(interaction, text) {
    return __awaiter(this, void 0, void 0, function* () {
      yield interaction
        .reply({
          ephemeral: true,
          embeds: [
            new discord_js_1.MessageEmbed()
              .setColor("#ff0000")
              .setDescription(":x: " + text),
          ],
        })
        .catch(this.client.Logger.error);
    });
  }
  get embed() {
    const embed = new discord_js_1.MessageEmbed().setTimestamp().setFooter({
      text: "EazyAutodelete",
      iconURL:
        "https://cdn.discordapp.com/avatars/748215564455116961/ff37be1ab3cdf46c6c4179dcc9c11a91.png?size=1024",
    });
    embed.color = 4605931;
    return embed;
  }
  get shard() {
    var _a;
    return (_a = this.client.shard) === null || _a === void 0 ? void 0 : _a.ids;
  }
}
exports.default = Command;
