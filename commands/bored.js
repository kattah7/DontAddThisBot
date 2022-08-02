const got = require('got');
const humanizeDuration = require('../humanizeDuration');
const utils = require('../util/utils.js');

module.exports = {
    name: 'bored',
    aliases: [],
    cooldown: 3000,
    description: 'Get stuff to do every 12 hours',
    execute: async (message, args, client) => {
        const lastUsage = await bot.Redis.get(`test:${message.senderUsername}`);
        let { body: userData, statusCode } = await got(`http://www.boredapi.com/api/activity?participants=1`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        //console.log(userData);

        if (lastUsage) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 12) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 12;
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    return client.privmsg(
                        message.channelName,
                        `.me This command can only be used every 12hours. Please wait ${humanizeDuration(ms)}.`
                    );
                }
                return {
                    text: `This command can only be used every 12hours. Please wait ${humanizeDuration(ms)}.`,
                };
            }
        }
        await bot.Redis.set(`test:${message.senderUsername}`, Date.now(), 0);
        if (message.senderUsername == (await utils.PoroNumberOne())) {
            return client.privmsg(message.channelName, `.me ${message.senderUsername}, ${userData.activity}`);
        } else
            return {
                text: `${message.senderUsername}, ${userData.activity}`,
            };
    },
};
