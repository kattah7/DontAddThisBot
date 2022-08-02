const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'karma',
    cooldown: 3000,
    aliases: ['redditkarma', 'rk'],
    description: 'Check your reddit karma count',
    execute: async (message, args, client) => {
        if (!args[0]) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(message.channelName, `.me You need to specify a username!`);
            } else {
                return {
                    text: `You need to specify a username!`,
                };
            }
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
        //console.log(xdpoggers.data.redditorInfoByName)
        const xqcL = xdpoggers.data.redditorInfoByName;
        if (xqcL == null) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(message.channelName, `.me ${args[0]} not found BatChest`);
            } else {
                return {
                    text: `${args[0]} not found BatChest`,
                };
            }
        } else {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(
                    message.channelName,
                    `.me ${args[0]} has total ${xqcL.karma.total} karma on Reddit BatChest`
                );
            } else {
                return {
                    text: `${args[0]} has total ${xqcL.karma.total} karma on Reddit BatChest`,
                };
            }
        }
    },
};
