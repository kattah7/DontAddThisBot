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

        const poroData = await bot.DB.channels.count({}).exec();
        const poroData2 = await bot.DB.users.count({}).exec();

        if (banned == false) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${message.senderUsername}, TriHard 🏓 BOT UPTIME: ${humanizeDuration(process.uptime() * 1000 )} | Channels: ${poroData} | Seen Users: ${poroData2}`)
            } else {
                return {
                    text: `${message.senderUsername}, TriHard 🏓 BOT UPTIME: ${humanizeDuration(process.uptime() * 1000 )} | Channels: ${poroData} | Seen Users: ${poroData2}`,
                }; 
            } 
        } else if (banned == true) {
            return {
                text: `that msg is banned lol`
            }
        }
    },
};