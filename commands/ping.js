const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "ping",
    aliases: ["xd"],
    cooldown: 3000,
    description:"Bot response",
    poro: true,
    offline: true,
    execute: async (message, args, client) => {
        if (message.senderUsername == process.env.NUMBER_ONE) {
            client.privmsg(message.channelName, `.me ${message.senderUsername}, TriHard 🏓 BOT UPTIME: ${humanizeDuration(process.uptime() * 1000 )}`)
        } else {
            return {
                text: `${message.senderUsername}, TriHard 🏓 BOT UPTIME: ${humanizeDuration(process.uptime() * 1000 )}`,
            }; 
        }
    },
};
