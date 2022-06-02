const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "ping",
    aliases: ["xd"],
    cooldown: 3000,
    description:"Bot response",
    poro: true,
    execute: async (message, args, client) => {

       

        return {
            text: `${message.senderUsername}, TriHard 🏓 BOT UPTIME: ${humanizeDuration(process.uptime() * 1000 )}`,
        };
    },
};
