
const constants = require("../constants/constants.js");
import Bot from "./Bot"
/**
 * An Event which will be run by the bot instance.
 */
export default class BaseEvent {
    name: any;
    assets: any;
    colors: any;
    emojis: any;
    client: any;
    /**
     * The name of the event.
     * @param {String} name 
     * @param {Bot} client
     */
    constructor (name: string, client: Bot) {
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
    async run(client: Bot) {
        client.logger.warn("Base Event");
    };

    getShard(client: Bot) {
        return client.shard.ids?.[0];
    };
};