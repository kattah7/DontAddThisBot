const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'bot',
    aliases: [],
    cooldown: 3000,
    description: 'Check if user is a verified bot',
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        if (userData.bot == false) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                return client.privmsg(message.channelName, `.me ${targetUser}, BOT: false`);
            } else {
                return {
                    text: `${targetUser}, BOT: false`,
                };
            }
        } else if (userData.bot == true) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                return client.privmsg(message.channelName, `.me ${targetUser}, BOT: true MrDestructoid`);
            } else {
                return {
                    text: `${targetUser}, BOT: true MrDestructoid`,
                };
            }
        } else if (statusCode == 404) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                return client.privmsg(message.channelName, `.me ${userData.error}`);
            } else {
                return {
                    text: `${userData.error}`,
                };
            }
        }
    },
};
