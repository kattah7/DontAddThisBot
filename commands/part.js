module.exports = {
    name: "part",
    aliases: [],
    cooldown: 3000,
    description: "Part channel command",
    execute: async (message, args, client) => {
        // try to get and delete the channel from the database
        const channelData = await bot.DB.channels.findOneAndDelete({ id: message.senderUserID }).exec();
        const poroData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        if (!poroData) {
            if (channelData) {
                client.part(message.senderUsername);
                return { text: `Parting channel #${message.senderUserID}` };
            } else {
                return { text: `Not in channel #${message.senderUserID}` };
            }
        }

        if (channelData) {
            client.part(message.senderUsername);
            await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroCount: poroData.poroCount - 100 } } ).exec();
            return { text: `Parting channel #${message.senderUserID}` };
        } else {
            return { text: `Not in channel #${message.senderUserID}` };
        }
    },
};
