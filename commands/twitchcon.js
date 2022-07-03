const got = require("got")

module.exports = {
    name: "twitchcon",
    cooldown: 3000,
    description: "check if user has twitchcon badge.",
    aliases: ["tc"],
    execute: async(message, args, client) => {
        const query = []
            query.push({
                "operationName": "ViewerCard",
                "variables": {
                    "channelID": "137199626",
                    "channelLogin": `kattah`,
                    "giftRecipientLogin": `${args[0]}`,
                    "hasChannelID": "true",
                    "isViewerBadgeCollectionEnabled": "true",
                    "withStandardGifting": "true",
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "9afddab81b8b216f9370f3f96662d4cefe9eb5312dc4c133ace70fa0a24ec2af"
                    }
                }
            })

            const { body: pogger, statusCode2 } = await got.post('https://gql.twitch.tv/gql', {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
            },
            json: query
        })
        console.log(pogger[0].data.channelViewer.earnedBadges)
        const tc = pogger[0].data.channelViewer.earnedBadges.find(badge => badge.setID === 'twitchconEU2022')
        if (tc) {
            return {
                text: `${args[0]} is going to TwitchCon 2022 Amsterdam! PogChamp`
            }
        } else {
            return {
                text: `${args[0]} is not going to TwitchCon 2022 PoroSad maybe next year`
            }
        }
        
        }
    }