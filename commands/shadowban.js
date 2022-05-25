const got = require('got')

module.exports = {
    name: 'shadowban',
    description: 'Shadowban a user (Requires Mod)',
    cooldown: 1500,
    permission: 1,
    aliases: [],
    async execute(message, args) {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/v2/twitch/user?login=${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData) 

        const query = []
            query.push({
                "operationName": "UpdateLowTrustUserTreatment",
                "variables": {
                    "input": {
                        "channelID": `${message.channelID}`,
                        "targetID": `${userData[0].id}`,
                        "treatment": "RESTRICTED",
                    }
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "5ff4591da4a7b5c39344b551f32ceeca45f480f1d034510d430a29f760d57dec"
                    }
                }
            })

        got.post('https://gql.twitch.tv/gql', {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
            },
            json: query
        })
        return {
            text: `Shadowbanned ${targetUser}`
        }
    },
};