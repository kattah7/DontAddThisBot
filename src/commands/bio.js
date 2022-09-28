const got = require('got');

module.exports = {
    tags: 'stats',
    name: 'bio',
    cooldown: 3000,
    description: "Check user's bio",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        //console.log(userData)
        const bio = userData.bio;
        return {
            text: `${targetUser}'s bio, ${bio}`,
        };
    },
};
