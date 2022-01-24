const   { Client, Collection, User, Intents, GuildMember, SnowflakeUtil } = require("discord.js"),
        util = require("util"),
        WebHook = require("../utils/WebHook.js"),
        DatabaseHandler = require("@eazyautodelete/eazyautodelete-db-client"),
        Command = require("./Command.js"),
        Event = require("./Event.js"),
        Logger = require("../utils/Logger.js"),
        fs = require("fs/promises"),
        { writeFileSync, readFile, mkdir} = require("fs"),
        axios = require('axios'),
        path = require("path"),
        constants = require("../constants/constants.js"),
        { translate, Translator, locales } = require("@eazyautodelete/eazyautodelete-lang");

/**
 * The main class for the bot and main hub for interacting with the Discord API.
 */

class Bot extends Client {
    constructor(config) {
        super({
            intents: [
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                Intents.FLAGS.GUILD_INTEGRATIONS,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_MESSAGE_TYPING,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_WEBHOOKS
            ], 
            partials: [
                "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"
            ]
        });
        // config
        this.config = config || {};

        // 
        this.wait = util.promisify(setTimeout);

        // assets
        this.assets = constants.assets;
        this.colors = constants.assets.colors;
        this.customEmojis = constants.emojis;

        // event logging
        this.startedAt = new Date();
        this.startedAtString = `${this.startedAt.getFullYear()}-${this.startedAt.getMonth()-1}-${this.startedAt.getDate()} ${this.startedAt.getHours()}-${this.startedAt.getMinutes()}-${this.startedAt.getSeconds()}`
        this.eventLogPath = `${require.main.path}/log/shards/events/${this.shard.ids}/${this.startedAtString}.log`
        this.eventLog = ``;  
        this.activeEvents = [];

        mkdir(`${require.main.path}/log/shards/events/${this.shard.ids}`, () => {})
        writeFileSync(this.eventLogPath, "")

        setInterval(() => {
            if(this.eventLog === ``) return;

            readFile(this.eventLogPath, 'utf8', (err,data) => {
                data = `${data}${this.eventLog}`
                writeFileSync(this.eventLogPath, data)
                this.eventLog = ``
            })
        }, 1000)

        this.logEvent = function(eventName) {
            let d = new Date();
            this.eventLog = `${this.eventLog}
Shard-${this.shard.ids} - - ${`[${d.getDate()}/${d.toDateString().split(" ")[1]}/${d.getFullYear()}:${d.getHours().toString().length === 1 ? `0${d.getHours()}` : d.getHours()}:${d.getMinutes().toString().length === 1 ? `0${d.getMinutes()}` : d.getMinutes()}:${d.getSeconds().toString().length === 1 ? `0${d.getSeconds()}` : d.getSeconds()} +1200]`} "GET /${eventName} HTTP/1.1" 200 1 "-" "Bot" "-"`
        }

        // stats
        this.stats = {
            commandsRan: 0,
        };

        // language
        this.locales = locales;
        this.Translator = Translator;
        this.translate = translate;
        // this.translate({ phrase: "", locale: "" })

        // cooldown
        this.cooldownUsers = new Collection();

        // commands
        this.commands = new Collection();
        this.disabledCommands = new Map();

        readFile(`${require.main.path}/config/disabled.json`, (err, data) => {
            if(err) return this.Logger.error(err);
            for(let command in data) this.disableCommand(command, data[command]);
        });

        // ready
        this.ready = false;

        // loggin
        this.Logger = new Logger();
        this.logger = this.Logger;

        // database
        this.database = new DatabaseHandler({ redis: this.config?.redis, mongo: this.config?.mongo }, this.Logger);

        this.activeChannels = [];
        this.checkedChannels = [];

        // filters
        this.filters = {
            FLAGS: {
                PINNED: "pinned",
                NOT_PINNED: "not_pinned",
                REGEX: "regex",
                NOT_REGEX: "not_regex",
                ALL: "all",
                WITH_LINK: "with_link",
                WITHOUT_LINK: "without_link",
                WITH_EMOJIS: "with_emojis",
                WITHOUT_EMOJIS: "without_emojis",
                WITH_ATTACHMENT: "with_attachment",
                WITHOUT_ATTACHMENT: "without_attachment",
                USAGE_ALL: "all",
                USAGE_ONE: "one"
            },
        };

        /**
         * 
         * @param {Collection} messages 
         * @param {Array} filters 
         */
        this.filterMessages = function(messages, filters, filterUsage, regex) {
            let emojiRegex = /<a?:(\w+):(\d+)>/gm;
            let urlRegex = /(((http|https)\:\/\/)|www\.)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6}/

            let filteredMessages = new Collection();

            if(filterUsage === this.filters.FLAGS.USAGE_ALL) {
                messages.forEach(
                    message => {
                        let i = 0;
                        filters.forEach(filter => {
                            if(filter === this.filters.FLAGS.PINNED && message.pinned) i++;
                            if(filter === this.filters.FLAGS.NOT_PINNED && !message.pinned) i++;
                            if(filter === this.filters.FLAGS.REGEX && regex && regex?.test(message.contet)) i++;
                            if(filter === this.filters.FLAGS.NOT_REGEX && regex && !regex?.test(message.content)) i++;
                            if(filter === this.filters.FLAGS.WITH_ATTACHMENT && message?.attachments?.size >= 0) i++;
                            if(filter === this.filters.FLAGS.WITHOUT_ATTACHMENT && (!message.attachments || message?.attachments?.size === 0)) i++;
                            if(filter === this.filters.FLAGS.WITHOUT_EMOJIS && !emojiRegex.test(message.content)) i++;
                            if(filter === this.filters.FLAGS.WITH_EMOJIS && emojiRegex.test(message.content)) i++;
                            if(filter === this.filters.FLAGS.WITHOUT_EMOJIS && !emojiRegex.test(message.content)) i++;
                            if(filter === this.filters.FLAGS.WITH_LINK && urlRegex.test(message.content)) i++;
                            if(filter === this.filters.FLAGS.WITHOUT_LINK && !urlRegex.test(message.content)) i++;
                        })
                        if(i === filters.length) filteredMessages.set(message.id, message);
                        return;
                    }
                );
            } else if(filterUsage === this.filters.FLAGS.USAGE_ONE) {
                messages.forEach(
                    message => {
                        let i = 0;
                        filters.forEach(filter => {
                            if(filter === this.filters.FLAGS.PINNED && message.pinned) i++;
                            if(filter === this.filters.FLAGS.NOT_PINNED && !message.pinned) i++;
                            if(filter === this.filters.FLAGS.REGEX && regex && regex?.test(message.contet)) i++;
                            if(filter === this.filters.FLAGS.NOT_REGEX && regex && !regex?.test(message.content)) i++;
                            if(filter === this.filters.FLAGS.WITH_ATTACHMENT && message?.attachments?.size >= 0) i++;
                            if(filter === this.filters.FLAGS.WITHOUT_ATTACHMENT && (!message.attachments || message?.attachments?.size === 0)) i++;
                            if(filter === this.filters.FLAGS.WITHOUT_EMOJIS && !emojiRegex.test(message.content)) i++;
                            if(filter === this.filters.FLAGS.WITH_EMOJIS && emojiRegex.test(message.content)) i++;
                            if(filter === this.filters.FLAGS.WITHOUT_EMOJIS && !emojiRegex.test(message.content)) i++;
                            if(filter === this.filters.FLAGS.WITH_LINK && urlRegex.test(message.content)) i++;
                            if(filter === this.filters.FLAGS.WITHOUT_LINK && !urlRegex.test(message.content)) i++;
                        })
                        if(i !== 0) filteredMessages.set(message.id, message);
                        return;
                    }
                )
            }
            return filteredMessages;
        };
    };

    async bulkDelete(channel, messages) {
        if(!channel || typeof channel != "string") return [];
        if(Array.isArray(messages) || messages instanceof Collection) {
            let messageIds = messages instanceof Collection ? [...messages.keys()] : messages.map(x => x?.id || x);
            messageIds = messageIds.filter(id => Date.now() - SnowflakeUtil.deconstruct(id).timestamp < 1_209_600_000);
            if(messageIds.length === 0) return [];
            if(messageIds.length === 1) {
                await this.api.channels[channel].messages(messageIds[0]).delete().catch(error => {
                    this.Logger.error(error);
                    return [];
                });
                return messageIds;
            }
            await this.api.channels[channel].messages['bulk-delete'].post({ data: { messages: messageIds } }).catch(error => {
                this.Logger.error(error);
                return [];
            });
            return messageIds;
        };
    };

    createDeleteLog(channelId, messages) {
        if(!channelId || typeof channelId != "string") return [];
        if(Array.isArray(messages) || messages instanceof Collection) {
            let messageIds = messages instanceof Collection ? [...messages.keys()] : messages.map(x => x?.id || x);
            new WebHook(this.assets?.url?.messageWebhook)
                .setContent(`Deleted **${messageIds.length} messages** in \`#${channelId}\`.\n\n\`\`\`js\n${messageIds}\`\`\``)
                .send()
        }
    };

    disableCommand(command, reason) {
        if(this.disabledCommands.has(command)) return this.disabledCommands.get(command);
        this.disabledCommands.set(command, reason);
        let data = {};
        this.disabledCommands.forEach((value, key) => {
            data[key] = value;
        });
        writeFileSync(`${require.main.path}/config/disabled.json`, JSON.stringify(data));
        return reason;
    };

    enableCommand(command) {
        if(!this.disabledCommands.has(command)) return true;
        this.disabledCommands.delete(command);
        let data = {};
        this.disabledCommands.forEach((value, key) => {
            data[key] = value;
        });
        writeFileSync(`${require.main.path}/config/disabled.json`, JSON.stringify(data));
        return true;
    };

    parseDuration(duration) {
        var
        years = Math.floor((duration / (1000 * 60 * 60 * 24 * 7 * 365)) % 999),
        weeks = Math.floor((duration / (1000 * 60 * 60 * 24 * 7)) % 51),
        days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 7),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        seconds = Math.floor((duration / 1000) % 60),

        uptime = [
            (years === 1) ? years + " " + "year" : years + " " + "years",
            (weeks === 1) ? weeks + " " + "week" : weeks + " " + "weeks",
            (days === 1) ? days + " " + "day" : days + " " + "days",
            (hours === 1) ? hours + " " + "hour" : hours + " " + "hours",
            (minutes === 1) ? minutes + " " + "minute" : minutes + " " + "minutes",
            (seconds === 1) ? seconds + " " + "second" : seconds + " " + "seconds",
        ].filter((time) => !time.startsWith("0")).join(", ");

        return uptime;
    };

    parseDate(timestamp) {
        let date = new Date(timestamp)

        let day = (date.getDate().toString().length === 1) ? "0"+date.getDate().toString() : date.getDate().toString()
        let month = ((date.getMonth()+1).toString().length === 1) ? "0"+(date.getMonth()+1).toString() : (date.getMonth()+1).toString()

        let hours = (date.getHours().toString().length === 1) ? "0"+date.getHours().toString() : date.getHours().toString()
        let minutes = (date.getMinutes().toString().length === 1) ? "0"+date.getMinutes().toString() : date.getMinutes().toString()
        let seconds = (date.getSeconds().toString().length === 1) ? "0"+date.getSeconds().toString() : date.getSeconds().toString()

        return (date.getFullYear()+"."+month+"."+day+" "+hours+":"+minutes+":"+seconds+"")
    };

    /**
     * Fetches a specifiec value of the Bot cross all shards.
     * @param {String} value 
     * @returns {Array<String>}
     */
    async clientValue(value) {
        let results = await this.shard.fetchClientValues(value).catch(this.Logger.error);
        return results ? results.reduce((prev, val) => prev + val, 0) : undefined;
    };

    /**
     * Sends Status Message of shard to discord server
     * @param {String} message 
     */
    sendShardWebhook(message) {
        if(!this.assets?.url?.statusWebhook || !message) return;

        new WebHook(this.assets.url.statusWebhook)
            .setContent(message)
            .send();
    };

    sendGuildWebhook(message) {
        if(!this.assets?.url?.logs?.guilds || !message) return;

        new WebHook(this.assets.url.logs.guilds)
            .setContent(message)
            .send();
    };

    /**
     * Runs code on all currently running shards.
     * @param {String} input 
     * @returns {Array<String>}
     */
    async shardEval(input) {
        let results = await this.shard.broadcastEval(input).catch(this.Logger.error)
        return results;
    };

    /**
     * Returns the custom emoji collection.
     */
    get emojis() {
        return this.customEmojis;
    };

    /**
     * @param {String} search 
     * @param {String} guild
     * @returns {GuildMember}
     */
     async resolveMember (search, guild){
        let member;
        if (!search || typeof search !== "string") return;
        // Try ID search
        if (search.match(/^<@!?(\d+)>$/)){
            const id = search.match(/^<@!?(\d+)>$/)[1];
            member = await guild.members.fetch(id).catch(() => {});
            if (member) return member;
        }
        // Try username search
        if (search.match(/^!?([^#]+)#(\d+)$/)){
            await guild.members.fetch();
            member = guild.members.cache.find((m) => m.user.tag === search);
            if (member) return member;
        }
        member = await guild.members.fetch(search).catch(() => {});
        return member;
    }

    /**
     * Fetches an channel from the Discord API.
     * @param {String} id 
     * @returns {Promise<Guild>}
     */
     async getApiGuild(id) {
        const headers = {
            "Authorization": `Bot ${this.config.token}`
        };

        let apiResult = await axios.get(`http://discord.com/api/guilds/${id}`, { headers: headers });
        apiResult = JSON.parse(apiResult.body);

        return apiResult;
    };

    /**
     * Fetches an User from the Discord API.
     * @param {String} id 
     * @returns {User}
     */
    async getApiUser(id) {
        const headers = {
            "Authorization": `Bot ${this.config.token}`
        };
        
        let apiResult = await axios.get(`http://discord.com/api/users/${id}`, { headers: headers });
        apiResult = JSON.parse(apiResult.body);

        if(!apiResult.id) return undefined;

        let user = {
            id: apiResult.id,
            tag: apiResult.username+"#"+apiResult.discriminator,
            avatar: `https://cdn.discordapp.com/avatars/${apiResult.id}/${apiResult.avatar}.png`,
            username: apiResult.username,
            bot: apiResult.bot,
            banner: `https://cdn.discordapp.com/banners/${apiResult.id}/${apiResult.banner}.png`
        };
        return user;
    };

    async registerEvents(dir = '') {
        const files = await fs.readdir(dir);
        for(const file of files) {
            const stat = await fs.lstat(`${dir}/${file}`);
            if(stat.isDirectory()) this.registerEvents(`${dir}/${file}`);
            if(file.endsWith('.js')) {
                const event = require(`${dir}/${file}`);
                if(event.prototype instanceof Event) {
                    const evnt = new event(this);
                    this.on(evnt.name, evnt.run.bind(evnt, this));
                    this.activeEvents.push(evnt.name)
                };
            };
        };
    };
    
    async registerCommands(dir = '') {
        const files = await fs.readdir(dir);
        console.log("333"+files);
        console.log("444"+dir)
        for(const file of files) {
            console.log("222"+file)
            console.log(`111, ${dir}/${file}`)
            const stat = await fs.lstat(`${dir}/${file}`);
            if(stat.isDirectory()) this.registerCommands(`${dir}/${file}`);
            if(file.endsWith('.js')) {
                const command = require(`${dir}/${file}`);
                if(command.prototype instanceof Command) {
                    const cmd = new command(this)
                    this.commands.set(cmd.help.name, cmd);
                };
            };
        };
    };


};

module.exports = Bot;