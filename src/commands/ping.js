const humanizeDuration = require("../util/humanizeDuration");

module.exports = {
    name: "ping",
    aliases: ["xd"],
    cooldown: 3000,
    description:"Bot response",
    poro: true,
    stvOnly: true,
    execute: async (message, args, client) => {
        const poroData = await bot.DB.channels.count({ isChannel: true }).exec();
        const poroData2 = await bot.DB.users.count({}).exec();
        return {
            text: `${message.senderUsername}, TriHard 🏓 BOT UPTIME: ${humanizeDuration(process.uptime() * 1000)} | Channels: ${poroData} | Seen Users: ${poroData2}`
        }
    },
};
