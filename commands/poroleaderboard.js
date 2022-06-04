module.exports = {
    name: "leaderboard",
    cooldown: 10000,
    aliases: ["lb"],
    description: "See leaderboard of poro meat",
    poro: true,
    execute: async (message, args, client) => {
        const poroData = await bot.DB.poroCount.find({}).exec();

        const sorted = poroData.sort((a, b) => b.poroCount - a.poroCount);

        const top5 = sorted.slice(0, 5);
        const top5String = top5.map((user) => `${user.username} - ${user.poroCount} `).join(" | ");

        if (message.senderUsername == process.env.NUMBER_ONE) {
            client.privmsg(message.channelName, `.me kattahXd Poro leaderboard: ${top5String}`)
        } else {
            return {
                text: `kattahXd Poro leaderboard: ${top5String}`,
            };
        }
    },
};