module.exports = {
    name: "vanish",
    aliases: ["v"],
    cooldown: 3000,
    execute: async (message, args, client) => {
        client.privmsg(message.channelName, `.timeout ${message.senderUsername} 1`);
    },
};