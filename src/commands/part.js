module.exports = {
    name: "part",
    aliases: [],
    cooldown: 3000,
    description: "Part channel command",
    execute: async (message, args, client) => {
        // try to get and delete the channel from the database
        const channelData = await bot.DB.channels.findOneAndUpdate({ id: message.senderUserID }, { $set: { isChannel: false } }).exec();
        if (!channelData || !channelData.isChannel) {
            return { text: `Not in channel #${message.senderUsername}` };
        }

        if (channelData.isChannel) {
            try {
                await client.part(message.senderUsername);
                return { text: `Parting channel #${message.senderUsername}` };
            } catch (error) {
                return { text: `Error leaving channel #${message.senderUsername}` };
            }
        }

    },
};
