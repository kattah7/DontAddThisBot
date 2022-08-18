const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'firstclip',
    aliases: ['fc'],
    cooldown: 3000,
    execute: async(message, args, client) => {
        const targetUser = await utils.ParseUser(args[0] ?? message.channelName);
        const UserID = await utils.IDByLogin(targetUser);
        if (!UserID || !/^[A-Z_\d]{2,26}$/i.test(targetUser)) {
            return {
                 text: "malformed username parameter",
            }
        };
        const query = [];
        query.push({
            operationName: 'ClipsManagerTable_User',
            variables: {
                limit: 20,
                login: targetUser,
                criteria: {
                    curatorID: UserID,
                    period: `ALL_TIME`,
                    sort: `CREATED_AT_ASC`,
                }
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '604a53d7404bda99ce534bff450d46140354d1b4716b8cf81be372689928c1a0',
                },
            },
        });

        const { body: pogger } = await got.post('https://gql.twitch.tv/gql', {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
            },
            json: query,
        });
        //console.log(edges[0].node)
        try {
            const {edges} = pogger[0].data.user.clips
            if (edges.length == 0) {
                return {
                    text: `${targetUser} has never clipped before :p`,
                };
            }
            if (edges.length > 0) {
                return {
                    text: `First clip: ${edges[0].node.url} by ${edges[0].node.curator.login} in #${edges[0].node.broadcaster.login} | Game: ${edges[0].node.game.name} | Date: ${edges[0].node.createdAt.split("T")[0]} | Title: ${edges[0].node.title} | TotalViews: ${edges[0].node.viewCount}`,
                }
            }
        } catch (error) {
            return {
                text: `PoroSad bot requires editor in #${targetUser} to check`,
            };
        }
    }
}