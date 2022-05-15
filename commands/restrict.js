module.exports = {
    name: "shadowban",
    aliases: ["restrict"],
    cooldown: 3000,
    permission: 1, //1 = mod, 2 = broadcaster
    description:"Shadow ban a user",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        client.privmsg(message.channelName, `/restrict ${targetUser}`);
    },
};