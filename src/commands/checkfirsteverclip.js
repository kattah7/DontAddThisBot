const { GetClips } = require('../token/gql');
const utils = require('../util/twitch/utils.js');

module.exports = {
    tags: 'stats',
    name: 'firstclip',
    aliases: ['fc'],
    cooldown: 3000,
    canOptout: true,
    target: 'channel',
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0] ?? message.channelName);
        const UserID = await utils.IDByLogin(targetUser);
        if (!UserID || !/^[A-Z_\d]{2,26}$/i.test(targetUser)) {
            return {
                text: 'malformed username parameter',
            };
        }
        const pogger = await GetClips(targetUser, UserID);
        try {
            const { edges } = pogger.data.user.clips;
            if (edges.length == 0) {
                return {
                    text: `${targetUser} has never clipped before :p`,
                };
            }
            if (edges.length > 0) {
                return {
                    text: `First clip: ${edges[0].node.url} by ${edges[0].node.curator.login} in #${
                        edges[0].node.broadcaster.login
                    } | Game: ${edges[0].node.game.name} | Date: ${edges[0].node.createdAt.split('T')[0]} | Title: ${
                        edges[0].node.title
                    } | TotalViews: ${edges[0].node.viewCount}`,
                };
            }
        } catch (error) {
            return {
                text: `PoroSad bot requires editor in #${targetUser} to check`,
            };
        }
    },
};
