const utils = require('../util/utils.js');

module.exports = {
    name: "botpart",
    aliases: [],
    cooldown: 3000,
    description: "Part channel command (level 3 only)",
    execute: async (message, args, client) => {
        // try to get and delete the channel from the database
        const targetUser = await utils.ParseUser(args[0]?.toLowerCase());
        const targetUserID = await utils.IDByLogin(targetUser);
        const channelData = await bot.DB.channels.findOne({ id: targetUserID }).exec();
        if (channelData) {
            const channelModAdded = channelData.addedBy.find((user) => user.id == message.senderUserID) ?? message.senderUsername == channelData.username;
            const isAddedByModerator = channelData.addedBy.length > 0 ? `you must be the moderator "${channelData.addedBy[0].username}" or broadcaster to part` : "Only the broadcaster can part";
            if (channelModAdded) {
                try {
                    await client.part(targetUser);
                    await bot.DB.channels.findOneAndDelete({ id: targetUserID }).exec();
                    return {
                        text: `Parted channel #${targetUser}`,
                    }
                } catch (err) {
                    console.log(err);
                    return {
                        text: 'Failed to part channel PoroSad try again later.',
                    }
                }
            } else {
                return {
                    text: `You can't do that, ${isAddedByModerator}. kattahHappy`
                }
            }
        } else {
            return { text: `Not in channel #${targetUser}` };
        }
    },
};
