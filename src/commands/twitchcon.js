const { GetBadges } = require('../token/gql.js');
const { ParseUser } = require('../util/utils.js');

module.exports = {
    tags: 'stats',
    name: 'twitchcon',
    cooldown: 3000,
    description: 'check if user has twitchcon badge.',
    aliases: ['tc'],
    execute: async (message, args, client) => {
        const targetUser = await ParseUser((args[0] ?? message.senderUsername).toLowerCase());
        const { activeTargetUser, channelViewer } = (await GetBadges(targetUser)).data;

        if (activeTargetUser == null) {
            return {
                text: `${targetUser} is not a valid username??`,
            };
        }
        if (channelViewer.earnedBadges == null) {
            return {
                text: `${targetUser} is not going to TwitchCon 2022 PoroSad maybe next year`,
            };
        }
        const tc = channelViewer.earnedBadges.find((badge) => badge.setID === 'twitchconNA2022');
        if (tc) {
            return {
                text: `${targetUser} is going to TwitchCon 2022 San Diego! PogChamp`,
            };
        } else {
            return {
                text: `${targetUser} is not going to TwitchCon 2022 PoroSad maybe next year`,
            };
        }
    },
};
