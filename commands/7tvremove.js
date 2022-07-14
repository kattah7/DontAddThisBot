const got = require("got")
const SevenTV = require("7tv");
const api = SevenTV()

module.exports = {
    name: "remove",
    description: "Remove 7tv emote from channel",
    cooldown: 3000,
    execute: async(message, args, client) => {
        let { body: userData, statusCode } = await got(`https://api.7tv.app/v2/users/${message.channelName}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        const { body: pogger, statusCode2 } = await got.post(`https://api.7tv.app/v2/gql`, { // find editors
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                "query": "query GetUser($id: String!) {user(id: $id) {...FullUser,, banned, youtube_id}}fragment FullUser on User {id,email, display_name, login,description,role {id,name,position,color,allowed,denied},emote_aliases,emotes { id, name, status, visibility, width, height },owned_emotes { id, name, status, visibility, width, height },emote_ids,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},editor_in {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},follower_count,broadcast {type,title,game_name,viewer_count,},twitch_id,broadcaster_type,profile_image_url,created_at,emote_slots,audit_entries {id,type,timestamp,action_user_id,action_user {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},changes {key, values},target {type,data,id},reason}}",
                "variables": {
                    "id": userData.id
                }
            }
        })
        const findEditor = pogger.data.user.editors.find(editor => editor.id === "629d77a20e60c6d53da64e38");
        const findChannelEditor = pogger.data.user.editors.find(editor => editor.login === message.senderUsername);
        if (message.senderUsername.toLowerCase() == message.channelName.toLowerCase() || findChannelEditor) {
        if (findEditor) {
        const { body: stv } = await got.post(`https://api.7tv.app/v2/gql`, { // find emotes
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                "query": "query GetUser($id: String!) {user(id: $id) {...FullUser,, banned, youtube_id}}fragment FullUser on User {id,email, display_name, login,description,role {id,name,position,color,allowed,denied},emote_aliases,emotes { id, name, status, visibility, width, height },owned_emotes { id, name, status, visibility, width, height },emote_ids,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},editor_in {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},follower_count,broadcast {type,title,game_name,viewer_count,},twitch_id,broadcaster_type,profile_image_url,created_at,emote_slots,audit_entries {id,type,timestamp,action_user_id,action_user {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},changes {key, values},target {type,data,id},reason}}",
                "variables": {
                    "id": `${message.channelName}`
                }
            }
        })
            const findEmote = stv.data.user.emotes.find(emote => emote.name === args[0]);
            if (!findEmote) {
                return {
                    text: `Could not find emote ${args[0]} XD`
                }
            } else if (findEmote) {
                const xd = await api.fetchUser(`${message.channelName}`);
                const { body: poggers } = await got.post(`https://7tv.io/v3/gql`, { // remove emote
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
                    "emote_id": findEmote.id,
                            "id": xd.id,
                },
                "type": "connection_init"
            }
        })
        console.log(stv.data.user.emotes)
        console.log(poggers)
        return {
            text: `removed ${findEmote.name} from chat`
                }
            }      
        } else {
            return {
                text: `Please grant @DontAddThisBot as a editor :)`
            }
        }   
    } else {
        return {
            text: `ur not editor in ${message.channelName}!!!`
        }
    }
}
}





  