const utils = require("../util/utils.js");

module.exports = {
    name: "leaderboard",
    cooldown: 10000,
    aliases: ["lb"],
    description: "See leaderboard of poro meat",
    poro: true,
    execute: async (message, args, client) => {
        const poroData = await bot.DB.poroCount.find({}).exec();

        const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);

        const top5 = sorted.slice(1449, 1450);
        const top5String = top5.map((user) => `${user.username} - [P:${user.poroPrestige}] ${user.poroCount.toLocaleString()} `).join(" | ");

        if (message.senderUsername == await utils.PoroNumberOne()) {
            client.privmsg(message.channelName, `.me kattahXd Poro leaderboard: ${top5String}`)
        } else {
            return {
                text: `kattahXd Poro leaderboard: ${top5String}`,
            };
        }
    },
};