const Bot = require("./Bot");
const constants = require("../constants/constants.js");
/**
 * An Event which will be run by the bot instance.
 */
class BaseEvent {
    /**
     * The name of the event.
     * @param {String} name 
     * @param {Bot} client
     */
    constructor (name, client) {
        this.name = name;
        this.assets = constants.assets;
        this.colors = constants.assets.colors;
        this.emojis = constants.emojis;
        this.client = client;
    };
    /**
     * The {@link Bot} the event belongs to
     * @param {Bot} client
     */
    async run(client) {
        client.logger.warn("Base Event");
    };

    getShard(client) {
        return client.shard.ids?.[0];
    };
};

module.exports = BaseEvent;