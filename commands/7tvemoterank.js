const got = require("got")
const utils = require("../util/utils.js");

module.exports = {
    name: "7tvrank",
    cooldown: 3000,
    aliases: ["7tvr"],
    description: "Check 7tvrank of an emote",
    execute: async(message, args, client) => {
        const { body: STVEmoteSearch } = await got.post(`https://7tv.io/v3/gql`, { 
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                "operationName": "SearchEmotes",
                "query": "query SearchEmotes($query: String!, $page: Int, $limit: Int) {\n  emotes(query: $query, page: $page, limit: $limit) {\n    count\n    items {\n      id\n      name\n      listed\n      owner {\n        id\n        username\n        display_name\n        tag_color\n        __typename\n      }\n      flags\n      images {\n        name\n        format\n        url\n        width\n        height\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
                "variables": {
                    limit: 200000,
                    query: ""
                    }
                }
            })
            //console.log(STVEmoteSearch)
            const AllEmotes = STVEmoteSearch.data.emotes.items
            const FindEmoteFromAllEmotes = STVEmoteSearch.data.emotes.items.find(emote => emote.name === args[0])
            const index = parseInt((AllEmotes.findIndex((x) => x.name === args[0]))) + 1
            //console.log(index)
            if (index === 0) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    return client.privmsg(message.channelName, `.me couldnt fetch emote :p`)
                } else {
                    return {
                        text: `couldnt fetch emote :p`
                    }
                }
            }
            const { body: STVEmoteUsers } = await got.post(`https://7tv.io/v3/gql`, { 
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                "operationName": "GetEmoteChannels",
                "query": "query GetEmoteChannels($id: ObjectID!, $page: Int, $limit: Int) {\n  emote(id: $id) {\n    id\n    channels(page: $page, limit: $limit) {\n      total\n      items {\n        id\n        username\n        display_name\n        avatar_url\n        tag_color\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
                "variables": {
                    "id": FindEmoteFromAllEmotes.id,
                    }
                }
            })
            //console.log(STVEmoteUsers)
            const Users = STVEmoteUsers.data.emote.channels.total.toLocaleString()
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me #${index}/${AllEmotes.length} | ${Users + " Users"}`)
            } else {
                return {
                    text: `#${index}/${AllEmotes.length} | ${Users + " Users"}`
                }
            }
    }
}