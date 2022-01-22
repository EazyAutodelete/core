const Bot = require("./Bot");
const Event = require("./Event.js")

/**
 * An Event which will be run by the bot instance.
 */
class ShardEvent extends Event {
    /**
     * The name of the event.
     * @param {String} name 
     */
    constructor (options) {
        super(options)
      //  this.assets = require("../../../constants/assets.js.js");
      //  this.emojis = require("../../constants/emojis.js");
      //  this.colors = this.assets.colors;
    };
};

module.exports = ShardEvent;