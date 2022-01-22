module.exports = async function(apitoken, guildCount, shardCount = 1) {
    if(!apitoken || !guildCount) return;

    const { API } = require(`@top-gg/sdk`);
    const TopGG = new API(apitoken);

    return await TopGG.postStats({
        serverCount: guildCount,
        shardCount: shardCount
    });
};