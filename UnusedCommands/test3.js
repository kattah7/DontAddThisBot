const got = require("got");

sendNotification = async () => {
    test = setInterval(async () => {
        const { body: poggers } = await got.post(`https://7tv.io/v3/gql`, {
                    throwHttpErrors: false,
                    responseType: 'json',
                    headers: {
                    Authorization: process.env.STV_AUTH,
                    },
                    json: {
                "extensions": {},
                "operationName": "ChangeEmoteInSet",
                "query": "mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\n  emoteSet(id: $id) {\n    id\n    emotes(id: $emote_id, action: $action, name: $name) {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}",
                "variables": {
                    "action": "REMOVE",
                    "emote_id": "60ae8ad4f6a2c3b332942368",
                        "id": "628b901eed0a40a5ec5f25d1",
                },
                "type": "connection_init"
            }
        })
        console.log(poggers)
    }, 4);
};

sendNotification();