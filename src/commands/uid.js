const got = require('got');

module.exports = {
    tags: 'stats',
    name: 'uid',
    cooldown: 3000,
    description: 'Gets user ID of a targeted user',
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/v2/twitch/user?login=${targetUser}`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        //console.log(userData)
        if (userData) {
            if (userData[0].banned == true) {
                return {
                    text: `${targetUser}'s UID ${userData[0].id} PoroSad (${userData[0].banReason})`,
                };
            } else if (userData[0].banned == false) {
                return {
                    text: `${targetUser}'s UID ${userData[0].id} BatChest`,
                };
            }
        }
    },
};
