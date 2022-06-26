const humanizeDuration = require("../humanizeDuration");
const got = require("got");

module.exports = {
    name: "ping",
    aliases: ["xd"],
    cooldown: 3000,
    description:"Bot response",
    poro: true,
    execute: async (message, args, client) => {
        const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': message.senderUsername}}).json();
        console.log(banned, banphrase_data)
        const poroData = await bot.DB.channels.find({}).exec();

        const sorted = poroData.sort((a, b) => b.poroCount - a.poroCount);

        const kekw = sorted.slice(0, 5000000);

        const poroData2 = await bot.DB.users.find({}).exec();

        const sorted2 = poroData2.sort((a, b) => b.poroCount - a.poroCount);

        const kekw2 = sorted2.slice(0, 5000000);
        if (banned == false) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${message.senderUsername}, TriHard 🏓 BOT UPTIME: ${humanizeDuration(process.uptime() * 1000 )} | Channels: ${kekw.length} | Seen Users: ${kekw2.length}`)
            } else {
                return {
                    text: `${message.senderUsername}, TriHard 🏓 BOT UPTIME: ${humanizeDuration(process.uptime() * 1000 )} | Channels: ${kekw.length} | Seen Users: ${kekw2.length}`,
                }; 
            } 
        } else if (banned == true) {
            return {
                text: `that msg is banned lol`
            }
        }
    },
};
