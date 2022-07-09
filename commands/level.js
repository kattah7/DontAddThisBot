module.exports = {
    name: "level",
    description: "Shows the user's level.",
    aliases: ["lvl"],
    cooldown: 5000,
    async execute(message, args, client, userdata) {
        const user = args[0] ? args[0].toLowerCase() : message.senderUsername;

        const data = await bot.DB.users.findOne({ username: user }).exec();

        if (!data) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${user} has not been seen before.`)
            } else {
                return {
                    text: `${user} has not been seen before.`,
                };
            }
        } else {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${user} is level ${data.level} (${bot.Utils.misc.levels[data.level]})`)
            } else {
                return {
                    text: `${user} is level ${data.level} (${bot.Utils.misc.levels[data.level]})`,
                };
            }
        }
    },
};
