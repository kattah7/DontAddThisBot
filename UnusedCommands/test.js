require("dotenv").config();
const got = require("got");

module.exports = {
    name: "test",
    cooldown: 10000,
    description: "Test",
    execute: async (message, args, client) => {
        const { body: poggers } = await got.post(`https://7tv.io/v3/gql`, {
                    throwHttpErrors: false,
                    responseType: 'json',
                    headers: {
                    Authorization: process.env.STV_AUTH,
                    },
                    json: {
                "extensions": {},
                "operationName": "UpdateUserConnection",
                "query": "mutation UpdateUserConnection($id: ObjectID!, $conn_id: String!, $d: UserConnectionUpdate!) {  user(id: $id) {    connections(id: $conn_id, data: $d) {      id      platform      display_name      emote_set_id      __typename    }    __typename  }}",
                "variables": {
                    "id": "60ae66f69627f9aff40e0c6d",
                    "conn_id": "137199626",
                    "d": {
                        "emote_set_id": "62d05e77641d8b4b788e0e03"
                    }
                },
                "type": "connection_init"
            }
        })
        console.log(poggers)
        console.log(poggers.data.user.connections)
    }
}