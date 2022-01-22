const Bot = require("../structures/Bot.js");
const Command = require("../structures/Command.js");
const Event = require("../structures/Event.js");
const ShardEvent = require("../structures/ShardEvent");
const Logger = require("../utils/Logger.js");
const WebHook = require("../utils/WebHook.js");
const Utils = require("../utils/Utils.js");
const constants = require("../constants/constants.js");
const emojis = require("../constants/emojis/emojis.js");
const assets = require("../constants/assets/assets.js");
const colors = require("../constants/assets/colors/colors.js");
const images = require("../constants/assets/img/images.js");
const permissions = require("../helpers/permissions.js");
const TopGG = require("../helpers/TopGG.js");
const DBL = require("../helpers/DBL.js");

module.exports = {
    Bot,
    Command,
    Event,
    ShardEvent,
    Logger,
    WebHook,
    Utils,
    constants,
    emojis,
    assets,
    colors,
    images,
    permissions,
    TopGG,
    DBL
};