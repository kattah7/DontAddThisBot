const { GetFirstFollows } = require('../token/gql');
const { ParseUser } = require('../util/twitch/utils.js');

module.exports = {
    tags: 'stats',
    name: 'fcf',
    cooldown: 3000,
    description: 'Check your first follower.',
    execute: async (message, args, client) => {
        const targetUser = await ParseUser(args[0] ?? message.senderUsername);
        const { data } = await GetFirstFollows(targetUser);
        if (data) {
            if (data.user == null) {
                return {
                    text: `${targetUser} is either banned or doesnt exist.`,
                };
            } else if (data.user.followers.edges == null) {
                return {
                    text: `${targetUser} do not have any followers to display.`,
                };
            } else if (data.user.followers.edges[0].node == null) {
                const DATE = data.user.followers.edges[0].followedAt;
                return {
                    text: `Seems like ${targetUser} blocked this person :p following since ${DATE.split('T')[0]}`,
                };
            } else {
                const NAME = data.user.followers.edges[0].node.login;
                const DATE = data.user.followers.edges[0].followedAt;
                return {
                    text: `${targetUser} first ever follower, ${NAME} has been following since ${DATE.split('T')[0]}`,
                };
            }
        }
    },
};
