const got = require("got");

module.exports = {
    name: "rank",
    cooldown: 10000,
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

        const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': targetUser}}).json();
        console.log(banned, banphrase_data)
        const poroData = await bot.DB.poroCount.find({}).exec();

        const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);

        const kekw = sorted.slice(0, 5000000);

        if (banned == false) {
            if (kekw.findIndex((user) => user.username == targetUser) + 1 == 0) {
                return {
                    text: `${targetUser} not found in database PoroSad`
                }
            }
            return {
                text: `${targetUser} is rank #${kekw.findIndex((user) => user.username == targetUser) + 1}/${kekw.length} in the poro leaderboard! kattahBoom`,
            }
        } else if (banned == true) {
            return {
                text: `banned msg lol`
            }
        }
        
    
    }
}