module.exports = {
    name: "commands",
    aliases: ["commands"],
    cooldown: 3000,
    execute: async (message, args, client) => {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                return client.privmsg(message.channelName, `.me ${message.senderUsername}, https://poros.lol/commands WutFace`)
            } else {
                return {
                    text: `${message.senderUsername}, https://poros.lol/commands WutFace`,
                };
            }
    },
};