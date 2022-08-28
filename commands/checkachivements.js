const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'firststream',
    aliases: ['fs'],
    cooldown: 3000,
    execute: async(message, args, client) => {
        const targetUser = await utils.ParseUser(args[0] ?? message.channelName);
        const UserID = await utils.IDByLogin(targetUser);
        if (!UserID || !/^[A-Z_\d]{2,26}$/i.test(targetUser)) {
            return {
                 text: "malformed username parameter",
            }
        }
        const query = [];
        query.push({
            operationName: 'UseQuestsHook',
            variables: {
                channelID: UserID,
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: 'e8b929fa512631579421bb08114072c1cd3be15095034ac0649d726bcffb8404',
                },
            },
        });

        const { body: pogger } = await got.post('https://gql.twitch.tv/gql', {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Authorization': `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
            },
            json: query,
        });
        //console.log(pogger[0].errors[0].message)
        try {
            const {itBegins, pathToAffiliate} = pogger[0].data.user.quests;
            const isAffiliate = pathToAffiliate.completedAt ? `${pathToAffiliate.completedAt.split("T")[0]}` : false;
            if (itBegins.completedAt == null) {
                return {
                    text: `${targetUser} has never streamed before :p`,
                };
            } else {
                return {
                    text: `First stream: ${itBegins.completedAt.split("T")[0]} | Affiliated At: ${isAffiliate}`,
                };
            }
        } catch (error) {
            return {
                text: `PoroSad bot requires editor in #${targetUser} to check`,
            };
        }
    }
}