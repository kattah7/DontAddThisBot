const got = require('got')

module.exports = {
    name: 'announce',
    description: 'annoucement in chat',
    cooldown: 1500,
    aliases: ['ann'],
    async execute(message, args) {
        const query = []
            query.push({
                "operationName": "SendAnnouncementMessage",
                "variables": {
                    "input": {
                        "channelID": `${message.channelID}`,
                        "message": `${args.join(" ")}`,
                        "color": "PRIMARY",
                    }
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "f9e37b572ceaca1475d8d50805ae64d6eb388faf758556b2719f44d64e5ba791"
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
    },
};