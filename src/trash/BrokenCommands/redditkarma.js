const { UserInfo } = require('../../token/redditGQL.js');

module.exports = {
    tags: 'stats',
    name: 'karma',
    cooldown: 3000,
    aliases: ['redditkarma', 'rk'],
    description: 'Check your reddit karma count',
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `You need to specify a username!`,
            };
        }

        const { redditorInfoByName } = await UserInfo(args[0]);
        if (!redditorInfoByName.karma) {
            return {
                text: `${args[0]} not found BatChest`,
            };
        } else {
            return {
                text: `${args[0]} has total ${redditorInfoByName.karma.total} karma on Reddit BatChest`,
            };
        }
    },
};
