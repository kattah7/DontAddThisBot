const got = require('got');

module.exports = {
    tags: 'stats',
    name: 'pfp',
    aliases: [],
    cooldown: 3000,
    description: "Grabs user's Twitch profile picture",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
            },
        });

        const pfp = userData.logo;
        return {
            text: `${message.senderUsername}, ${pfp} BatChest`,
        };
    },
};
