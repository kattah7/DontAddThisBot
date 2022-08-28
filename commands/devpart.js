const utils = require('../util/utils.js');

module.exports = {
    name: "botpart",
    aliases: [],
    cooldown: 3000,
    level: 3,
    description: "Part channel command (level 3 only)",
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0])
        if (!args[0] || !/^[A-Z_\d]{3,25}$/i.test(targetUser)) {
            const isArgs = args[0] ? 'malformed username parameter' : 'Please provide a channel name';
            return {
                text: isArgs,
            }
        }
        // try to get and delete the channel from the database
        const channelData = await bot.DB.channels.findOneAndUpdate({ id: await utils.IDByLogin(targetUser.toLowerCase()) }, { $set: { isChannel: false } }).exec();
        if (!channelData || !channelData.isChannel) {
            return { text: `Not in channel #${targetUser}` };
        }

        if (channelData.isChannel) {
            try {
                await client.part(targetUser.toLowerCase());
                return { text: `Parting channel #${targetUser}` };
            } catch (error) {
                return { text: `Error leaving channel #${targetUser}` };
            }
        }
    },
};
