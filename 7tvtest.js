const got = require("got")

module.exports = {
    name: "test123",
    description: "Get user's 7tv profile picture",
    cooldown: 3000,
    execute: async(message, args, client) => {
        const { body: poggers } = await got.post(`https://7tv.io/v3/gql`, {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                Authorization: "",
            },
            json: {
                "extensions": {},
                "operationName": "ChangeEmoteInSet",
                "query": "mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\n  emoteSet(id: $id) {\n    id\n    emotes(id: $emote_id, action: $action, name: $name) {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}",
                "variables": {
                    "action": "REMOVE",
                    "emote_id": args[0],
                            "id": "60ae66f69627f9aff40e0c6d"
                },
                "type": "connection_init"
            }
        })
        console.log(poggers)
        return {
            text: `removed ${args[0]} from chat`
        }
    }
}


  