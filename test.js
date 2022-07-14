require("dotenv").config();
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
                    "action": "ADD",
                    "emote_id": "6279b90b6742b303838c4a29",
                            "id": "60ae66f69627f9aff40e0c6d",
                },
                "type": "connection_init"
            }
        })

        console.log(poggers);
    }, 1); // 10 => 15 subs | 100 => 3
};

sendNotification();