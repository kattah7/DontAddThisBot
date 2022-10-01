const got = require('got');

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
        const { body: xdpoggers } = await got.post('https://gql.reddit.com', {
            throwHttpErrors: true,
            responseType: 'json',
            headers: {
                Authorization: process.env.REDDIT_AUTH,
            },
            json: {
                id: 'db6eb1356b13',
                variables: {
                    name: args[0],
                },
            },
        });

        const xqcL = xdpoggers.data.redditorInfoByName;
        if (xqcL == null) {
            return {
                text: `${args[0]} not found BatChest`,
            };
        } else {
            return {
                text: `${args[0]} has total ${xqcL.karma.total} karma on Reddit BatChest`,
            };
        }
    },
};
