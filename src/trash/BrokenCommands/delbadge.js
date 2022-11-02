const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'delbadge',
    description: "remove bot's badge with 50 poro meat",
    cooldown: 3000,
    aliases: [],
    async execute(message, args, client) {
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        if (channelData.poroCount < 50) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                return client.privmsg(
                    message.channelName,
                    `.me Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | ${channelData.poroCount} meat total! 🥩`
                );
            }
            return {
                text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | ${channelData.poroCount} meat total! 🥩`,
            };
        } else {
            await bot.DB.poroCount
                .updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount - 50 } })
                .exec();
            const query = [];
            query.push({
                operationName: 'ChatSettings_DeselectGlobalBadge',
                variables: {},
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: '550287f1adb54f7628341351cd783f4dc7ec1afc99f1ac7826da6e2432969b5b',
                    },
                },
            });

            got.post('https://gql.twitch.tv/gql', {
                throwHttpErrors: false,
                responseType: 'json',
                headers: {
                    'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                    'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
                },
                json: query,
            });
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                return client.privmsg(
                    message.channelName,
                    `.me Badge Removed! PoroSad ${channelData.poroCount - 50} meat total! 🥩`
                );
            } else {
                return {
                    text: `Badge Removed! PoroSad ${channelData.poroCount - 50} meat total! 🥩`,
                };
            }
        }
    },
};
