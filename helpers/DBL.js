module.exports = async function(apitoken, guildCount, userCount = 310000) {
    if(!apitoken || !guildCount) return;

    const request = require("request");

    return request.post({
        url: "https://discordbotlist.com/api/v1/bots/746453621821931634/stats",
        method: "POST",
        body: JSON.stringify({
            guilds: guildCount,
            users: userCount
        }),
        headers: {
            "Authorization":apitoken
        }
    });
};