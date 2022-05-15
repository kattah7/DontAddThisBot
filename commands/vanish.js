module.exports = {
    name: "vanish",
    aliases: ["v"],
    cooldown: 3000,
    description:"hide yourself from chat",
    execute: async (message, args, client) => {
        client.privmsg(message.channelName, `.restrict ${message.senderUsername} `);
    },
};