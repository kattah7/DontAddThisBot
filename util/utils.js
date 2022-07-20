require("dotenv").config();
const got = require('got');

exports.loginByID = async (userID) => {
    if (!userID) return null
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}?id=true`, { responseType: 'json', throwHttpErrors: false })
    if (!userData.body.id) return null
    return userData.body.login
};

exports.IDByLogin = async (userID) => {
    if (!userID) return null
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}`, { responseType: 'json', throwHttpErrors: false })
    if (!userData.body.id) return null
    return userData.body.id
};

exports.getPFP = async (userID) => {
    if (!userID) return null
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}`, { responseType: 'json', throwHttpErrors: false })
    if (!userData.body.id) return null
    return userData.body.logo
};

exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
};

exports.splitArray = (arr, len) => {
    var chunks = [], i = 0, n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
};

exports.IDtoEmote = async (emote) => {
    if (!emote) return null
    const emoteData = await got(`https://api.7tv.app/v2/emotes/${emote}`, { responseType: 'json', throwHttpErrors: false })
    if (!emoteData.body.id) return null
    return emoteData.body.name
}

exports.NameToID = async (name) => {
    if (!name) return null
    const nameData = await got(`https://api.7tv.app/v2/users/${name}`, { responseType: 'json', throwHttpErrors: false })
    if (!nameData.body.id) return null
    return nameData.body.id
}

exports.channelEmotes = async (channel) => {
    if (!channel) return null
    const channelData = await got(`https://api.7tv.app/v2/users/${channel}/emotes`, { responseType: 'json', throwHttpErrors: false })
    if (!channelData) return null
    return channelData.body
}

exports.stvNameToID = async (name) => {
    if (!name) return null
    const nameData = await got(`https://api.7tv.app/v2/users/${encodeURIComponent(name)}`, { responseType: 'json', throwHttpErrors: false })
    if (!nameData.body.id) return null
    return nameData.body.id
}

exports.PoroNumberOne = async() => {
    const poroData = await bot.DB.poroCount.find({}).exec();
        const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);
        const top1 = sorted.slice(0, 1);
        for (const xd of top1) {
            return xd.username
        }
}

exports.ParseUser = async (user) => {
    const parsed = user.replace(/[@#,]/g, '') // Remove @, #, and ,
    return parsed
}

exports.ForsenTV = async (text) => {
    const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': text }}).json();
    return banned
}

exports.Nymn = async (text) => {
    const {banned, banphrase_data} = await got.post(`https://nymn.pajbot.com/api/v1/banphrases/test `, {json: {'message': text }}).json();
    return banned
}

exports.StvEditors = async (user) => {
    const { body: pogger, statusCode2 } = await got.post(`https://api.7tv.app/v2/gql`, { // find editors
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                "query": "query GetUser($id: String!) {user(id: $id) {...FullUser,, banned, youtube_id}}fragment FullUser on User {id,email, display_name, login,description,role {id,name,position,color,allowed,denied},emote_aliases,emotes { id, name, status, visibility, width, height },owned_emotes { id, name, status, visibility, width, height },emote_ids,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},editor_in {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},follower_count,broadcast {type,title,game_name,viewer_count,},twitch_id,broadcaster_type,profile_image_url,created_at,emote_slots,audit_entries {id,type,timestamp,action_user_id,action_user {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},changes {key, values},target {type,data,id},reason}}",
                "variables": {
                    "id": user
                }
            }
        })
        return pogger
}

exports.StvChannelEmotes = async (user) => {
    const { body: STVEmotesInChannel, error } = await got.post(`https://7tv.io/v3/gql`, { // find emotes
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                "operationName": "WatchEmoteSetMin",
                "query": "subscription WatchEmoteSetMin($id: ObjectID!, $init: Boolean) {\n  emoteSet(id: $id, init: $init) {\n    id\n    name\n    capacity\n    emotes {\n      id\n      name\n      __typename\n    }\n    owner {\n      id\n      display_name\n      tag_color\n      avatar_url\n      __typename\n    }\n    __typename\n  }\n}",
                "variables": {
                    "id": user,
                    init: true
                }
            }
        })
        return STVEmotesInChannel
}

exports.AliasSTVEmote = async (emote, userID, name) => {
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
                "action": "UPDATE",
                "emote_id": emote,
                "id": userID,
                "name": name
            },
                "type": "connection_init"
            }
        })
        return poggers
}

exports.AddSTVEmote = async (emote, channel) => {
    const { body: poggers2 } = await got.post(`https://7tv.io/v3/gql`, {
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
                    "emote_id": emote,
                            "id": channel,
                },
                "type": "connection_init"
            }
        })
        return poggers2
}
