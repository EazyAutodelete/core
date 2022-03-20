import { APIEmbed } from "discord-api-types";
import { MessageEmbed, MessageActionRow, MessageButton, MessageEmbedOptions, Interaction, CommandInteraction, AutocompleteInteraction, SelectMenuInteraction } from "discord.js";
import * as path from "path"
import Bot from "./Bot"

/**
 * An Application Command which will be posted globally on the bot.
 */

export default class BaseCommand {
    config: { options: any[]; name: string; description: string; cooldown: number; usage: string; example: string; permissionLevel: string; };
    help: { name: string; description: string; permissionLevel: string; cooldown: number; usage: string; example: string; aliases: any[]; };
    data: { name: any; description: any; options: any; };
    assets: any;
    colors: any;
    urls: any;
    emojis: any;
    Logger: any;
    reply: (interaction: any, input: any, ephemeral?: boolean, components?: any[]) => Promise<any>;
    client: Bot;
    constructor(client: Bot, {
        name = "",
        description = "",

        dirname = __dirname,

        permissionLevel = "Bot Dev",

        cooldown = 5000,

        aliases = [],

        example = "",

        usage = "",

		options = []
    }: any) {
        /**
         * The category the command will be displayed in.
         */
       // const category = (dirname ? dirname.split(path.sep)[parseInt(dirname.split(path.sep).length-1, 10)] : "General");

        /**
         * The Bot the Command belongs to.
         */
		this.client = client;

        /**
         * The config of the command.
         */
		this.config = { options, name, description, cooldown, usage, example, permissionLevel };

        /**
         * The data for any type of help commands to access.
         */
        const commandHelpData = { name, description, /*category,*/ permissionLevel, cooldown, usage, example, aliases };
		this.help = commandHelpData;

        /**
         * The data of the command
         */
        this.data = { name: this.help.name, description: this.help.description, options: this.config.options }

        /**
         * The asstes
         */
        this.assets = this.client.assets;

        /**
         * colors
         */
        this.colors = this.assets.colors;

        /**
         * urls
         */
        this.urls = this.assets.url;

        /**
         * emojis
         */
        this.emojis = this.client.emojis;

        /**
         * The logger
         * @type {Logger}
         */
        this.Logger = client?.Logger;

        this.reply = this.response;
    };

    docsButton(url: string) {
        return new MessageActionRow()
            .addComponents([ 
                new MessageButton()
                    .setDisabled(false)
                    .setEmoji("❓")
                    .setLabel("Help")
                    .setStyle("LINK")
                    .setURL(url),
            ]);
    };

    /**
     * The function being runned when an application command is executed.
     * @param {CommandInteraction} interaction 
     * @returns {null}
     */
	async run(interaction: CommandInteraction) {
        return this.Logger.warn("Ended up in command.js [" + this.config + "]");
    };

    /**
     * Handels the autocomplete function
     * @param {String} query 
     * @returns {Array}
     */
    autocompleteHandler(query: string) {
        this.Logger.warn("Ended up in command.js [" + this.config + "]");
        return [];
    }

    /**
     * Method to handle select menu interactions.
     * @param {AutocompleteInteraction} interaction 
     * @returns {Object[]}
     */
    selectMenuHandler(interaction: SelectMenuInteraction) {
        return;
    }

    /**
     * Returns a translated text by the keys.
     * @param {String} key 
     * @param {String} args 
     * @returns {String}
     */
    translate(options: any) {
        return this.client.translate(options)
    };

    /**
     * Responses to an application command.
     * @param {CommandInteraction} interaction
     * @param {(MessageEmbed | String | Array<MessageEmbed>)} input
     * @param {Boolean} [ephemeral = true]
     * @param {Array} [components = []]
     * @returns {Message}
     */
    async response(interaction: CommandInteraction, input: string | MessageEmbed | any, ephemeral = true, components: MessageActionRow | any) {
        if(typeof input === "object") {
            if(input.description || input.title) return await interaction.reply({ embeds: [ input ], components: components.components ? [ components ] : components, ephemeral: ephemeral }).catch(this.client.Logger.error);
            else return await interaction.reply({ embeds: input, components: components.components ? [ components ] : components, ephemeral: ephemeral }).catch(this.client.Logger.error)
        } else if(typeof input === "string") {
            return await interaction.reply({ content: input, components: components.components ? [ components ] : components, ephemeral: ephemeral }).catch(this.client.Logger.error);
        };
	};

    /**
     * Returns an error to an application command.
     * @param {CommandInteraction} interaction
     * @param {String} text The text of the error message.
     * @returns {Message}
     */
	error(interaction: CommandInteraction, text: string) {
        return interaction.reply({ ephemeral: true, embeds: [new MessageEmbed().setColor('#ff0000').setDescription(":x: " + text)] }).catch(this.client.Logger.error);
	};

    /**
     * Returns the template for a default response.
     * @returns {MessageEmbed}
     */
    get embed() {
        return class extends MessageEmbed {
            constructor(options: MessageEmbed | MessageEmbedOptions | APIEmbed) {
                super(options);
                this.color = 4605931,
                this.timestamp = Date.now(),
                this.footer = {
                    text: "EazyAutodelete",
                    iconURL: "https://cdn.discordapp.com/avatars/748215564455116961/ff37be1ab3cdf46c6c4179dcc9c11a91.png?size=1024"
                }
            }
        };
    };

    /**
     * Gets the Application API from the bot.
     * @returns {ClientApplication}
     */
	get rest() {
        return this.client.api;
    };

    get shard() {
        return this.client.shard.ids;
    }
};