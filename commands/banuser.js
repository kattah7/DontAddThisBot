module.exports = {
    name: "ban",
    aliases: [],
    cooldown: 3000,
    description: "Ban user from dontaddthisbot (admin only)",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername
        if (!["kattah", "fookstee"].includes(message.senderUsername)) return;

        await client.say(message.channelName, `Banned ${targetUser}`)
        
    },
};