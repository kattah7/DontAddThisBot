const got = require("got");
const utils = require("../util/utils.js");

module.exports = {
    name: "sharebans",
    aliases: ["sb"],
    cooldown: 3000,
    description: "Share bans of the channel",
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0] ?? message.channelName);
        const ID = await utils.IDByLogin(targetUser)
        const query = []
            query.push({
                "operationName": "BansSharingRelationships",
                "variables": {
                    "channelID": ID,
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "648406b19df4c486b50626443ef4a2842cfc8832a0eea9fbb82129553753c367"
                    }
                }
            })

            const { body: pogger, statusCode2 } = await got.post('https://gql.twitch.tv/gql', {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Authorization': `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
            },
            json: query
        })
        const shared = pogger[0].data.channel.bansSharingRelationships.acceptedRequests
        console.log(pogger[0].data.channel)
        if (shared == null) {
            return {
                text: `bot requires mod in #${targetUser} to check`,
            }
        }
        if (shared.length == 0) {
            return {
                text: `${targetUser} has no shared bans`,
            }
        }
        const mapped = shared.map(x => x.requestedUser.login + " (" + x.updatedAt.split("T")[0] + ")")

        const { key } = await got
            .post(`https://haste.fuchsty.com/documents`, {
                responseType: "json",
                body: mapped.join("\n"),
            })
            .json();
        return {
            text: `${targetUser}'s shared bans https://haste.fuchsty.com/${key}.txt`,
        }
    }
}