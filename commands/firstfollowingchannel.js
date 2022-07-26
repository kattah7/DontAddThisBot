const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'fcf',
    cooldown: 3000,
    description: 'Check your first follower.',
    aliases: ['firstchannelfollower'],
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const query = [];
        query.push({
            query: `{
                user(login: "${targetUser}") {
                    followers(order: ASC, first: 10) {
                        edges {
                            followedAt
                            node {
                                login
                            }
                        }
                    }
                }
            }`,
        });
        const { body: pogger, statusCode2 } = await got.post(`https://gql.twitch.tv/gql`, {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-GB',
                'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
                'Client-Version': `${process.env.CLIENT_VERSION}`,
                'Content-Type': 'text/plain;charset=UTF-8',
                'Referer': `https://dashboard.twitch.tv/`,
                'X-Device-Id': `${process.env.DEVICE_ID}`,
            },
            json: query,
        });
        console.log(pogger[0]);
        if (pogger[0].data) {
            if (pogger[0].data.user == null) {
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    return client.privmsg(message.channelName, `.me ${targetUser} is either banned or doesnt exist.`);
                }
                return {
                    text: `${targetUser} is either banned or doesnt exist.`,
                };
            } else if (pogger[0].data.user.followers.edges == null) {
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    return client.privmsg(
                        message.channelName,
                        `.me ${targetUser} do not have any followers to display.`
                    );
                }
                return {
                    text: `${targetUser} do not have any followers to display.`,
                };
            } else if (pogger[0].data.user.followers.edges[0].node == null) {
                const DATE = pogger[0].data.user.followers.edges[0].followedAt;
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    return client.privmsg(
                        message.channelName,
                        `.me Seems like ${targetUser} blocked this person :p following since ${DATE.split('T')[0]}`
                    );
                }
                return {
                    text: `Seems like ${targetUser} blocked this person :p following since ${DATE.split('T')[0]}`,
                };
            } else {
                const NAME = pogger[0].data.user.followers.edges[0].node.login;
                const DATE = pogger[0].data.user.followers.edges[0].followedAt;
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    return client.privmsg(
                        message.channelName,
                        `.me ${targetUser} first ever follower, ${NAME} has been following since ${DATE.split('T')[0]}`
                    );
                }
                return {
                    text: `${targetUser} first ever follower, ${NAME} has been following since ${DATE.split('T')[0]}`,
                };
            }
        }
    },
};
