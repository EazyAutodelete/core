const { Console } = require("console");
const { User } = require("discord.js");
const chalk = require("chalk");

class Logger extends Console {

    constructor() {
        super(process.stdout, process.stderr);
    };

    /**
     * @param {String} input
    */
    info(input, type = "INFO") {
        if(type === "BLANK") {
            return this.log(chalk.hidden("-"))
        }
        const mess = chalk.bold.cyan(this.date() + " - [ "+type+" ] => ") + input;
        this.log(mess);
    };

    /**
     * @param {String} input
    */
    error(input) {
        const mess = chalk.bold.redBright(this.date() + " - [ ERR- ] => ") + input;
        super.error(mess);
    };

    /**
     * @param {String} input
    */
    warn(input) {
        const mess = chalk.bold.yellow(this.date() + " - [ WARN ] => ") + input;
        super.warn(mess);
    };

    /**
     * @param {User} user
    */
    command(command, user) {
        
    };

    date(msTimeStamp = new Date().getTime()) {
        let date = new Date(msTimeStamp);

        var minutes = date.getMinutes();
        if(minutes.toString().length === 1) minutes = `0${minutes}`;

        var seconds = date.getSeconds();
        if(seconds.toString().length === 1) seconds = `0${seconds}`;

        return `[ ${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()} - ${date.getHours()}:${minutes}:${seconds} ]`;
    };
};

module.exports = Logger;