module.exports = {
    name: "shadowban",
    aliases: ["restrict"],
    cooldown: 3000,
    permission: 1, //1 = mod, 2 = broadcaster
    description:"Shadow ban a user",
    execute: async (message, args, client) => {
        client.privmsg(message.channelName, `.restrict ${message.senderUsername}`);
    },
};