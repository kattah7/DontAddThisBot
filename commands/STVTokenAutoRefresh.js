const got = require('got')

module.exports = {
    name: 'test',
    cooldown: 3000,
    execute: async(message, args, client) => {
        const { body: poggers3 } = await got.post(`https://7tv.io/v3/gql`, {
        // remove emote
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            Authorization: process.env.STV_AUTH,
        },
        json: {
            extensions: {},
            operationName: 'ChangeEmoteInSet',
            query: 'mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\n  emoteSet(id: $id) {\n    id\n    emotes(id: $emote_id, action: $action, name: $name) {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}',
            variables: {
                action: 'REMOVE',
                emote_id: "610ff51ed86cd785a4739e30",
                id: `628b901eed0a40a5ec5f25d1`,
            },
            type: 'connection_init',
        },
    });
    console.log(poggers3)
    }
}