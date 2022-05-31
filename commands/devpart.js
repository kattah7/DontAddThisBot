module.exports = {
    name: "botpart",
    aliases: [],
    cooldown: 3000,
    level: 3,
    description: "Part channel command (level 3 only)",
    execute: async (message, args, client) => {
        // try to get and delete the channel from the database
        const channelData = await bot.DB.channels.findOneAndDelete({ username: args[0].toLowerCase() }).exec();

        if (channelData) {
            client.part(args[0].toLowerCase());
            return { text: `Parting channel #${args[0].toLowerCase()}` };
        } else {
            return { text: `Not in channel #${args[0].toLowerCase()}` };
        }
    },
};
