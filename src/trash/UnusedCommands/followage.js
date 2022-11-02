const got = require('got');
const humanizeDuration = require('../util/humanizeDuration');

module.exports = {
    name: 'followage',
    aliases: ['fa'],
    cooldown: 3000,
    description: 'Check following age of user',
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName;
        let userData = await got(`https://api.ivr.fi/twitch/subage/${targetUser}/${targetChannel}`, {
            timeout: 10000,
        }).json();
        if (userData.followedAt) {
            const ms = new Date().getTime() - Date.parse(userData.followedAt);
            return {
                text: `${targetUser} has been following ${targetChannel} for ${humanizeDuration(ms)} BatChest`,
            };
        } else {
            return {
                text: `${targetUser} is not following ${targetChannel} PoroSad`,
            };
        }
    },
};
