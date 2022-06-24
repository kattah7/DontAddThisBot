module.exports = {
    name: "rank",
    cooldown: 1000,
    aliases: ["pororank"],
    description: "Check your rank in the poro leaderboard",
    poro: true,
    execute: async (message, args, client) => {
        if (!args[0]) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me insert name lol`)
            } else {
                return {
                    text: `insert name lol`
                }
            }
        }
        const targetUser = args[0].toLowerCase()
        const poroData = await bot.DB.poroCount.find({}).exec();

        const sorted = poroData.sort((a, b) => b.poroCount - a.poroCount);
        const kekw = sorted.slice(0, 5000000);
        if (kekw.findIndex((user) => user.username == targetUser) + 1 == 0) {
            return {
                text: `${targetUser} not found in database PoroSad`
            }
        }
        return {
            text: `${targetUser} is rank ${kekw.findIndex((user) => user.username == targetUser) + 1} in the poro leaderboard! kattahBoom`,
        }
    
    }
}