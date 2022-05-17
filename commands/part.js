module.exports = {
    name: "part",
    aliases: [],
    cooldown: 3000,
    description: "Part channel command",
    execute: async (message, args, client) => {
        // try to get and delete the channel from the database
        const channelData = await bot.DB.channels.findOneAndDelete({ id: message.senderUserID }).exec();

        if (channelData) {
            client.part(message.senderUsername);
            return { text: `Parting channel #${message.senderUserID}` };
        } else {
            return { text: `Not in channel #${message.senderUserID}` };
        }
    },
};
