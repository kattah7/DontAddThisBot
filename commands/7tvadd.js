const got = require("got")
const SevenTV = require("7tv");
const { ConsoleMessage } = require("puppeteer");
const api = SevenTV()
const utils = require('../util/utils.js');

module.exports = {
    name: "add",
    description: "Add 7tv emote from channel",
    cooldown: 3000,
    execute: async(message, args, client) => {
        if (!args[0]) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me Please provide a emote`)
            } else {
                return {
                    text: "Please provide a emote"
                }
            }
        }
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
        const findEmoteInChannel = pogger.data.user.emotes.find(emote => emote.name === args[0]);
        if (findEmoteInChannel) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me you already have that emote`)
            } else {
                return {
                    text: `you already have that emote`
                }
            }
        } 
        if (message.senderUsername.toLowerCase() == message.channelName.toLowerCase() || findChannelEditor) {
        if (findEditor) {
            
            const matcher="https://7tv.app/emotes/"
            const [url] = args;
            if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(url)) {
                const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(url)
                console.log(linkEmote)
                const xd = await api.fetchUser(`${message.channelName}`);
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
                    "emote_id": linkEmote[2],
                            "id": xd.id,
                },
                "type": "connection_init"
            }
        })
        if (message.senderUsername == await utils.PoroNumberOne()) {
            return client.privmsg(message.channelName, `.me Added ${await utils.IDtoEmote(linkEmote[2])} to chat`)
        } else {
            return {
                text: `Added ${await utils.IDtoEmote(linkEmote[2])} to chat`
            }
        }
                
            }
            if (args[1]) {
                console.log(await utils.channelEmotes(args[1]))
                const allChannelEmotes = await utils.channelEmotes(args[1])
                const findChannelEmote = allChannelEmotes.find(emote => emote.name === args[0]);
                if (findChannelEmote) {
                    const KEKG = await utils.IDtoEmote(findChannelEmote.id)
                    console.log(KEKG)
                    console.log(findChannelEmote.id)
                    const xd = await api.fetchUser(`${message.channelName}`);
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
                    "emote_id": findChannelEmote.id,
                            "id": xd.id,
                },
                "type": "connection_init"
            }
        })
        if (KEKG != args[0]) {
                const xd = await api.fetchUser(`${message.channelName}`);
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
                "emote_id": findChannelEmote.id,
                "id": xd.id,
                "name": args[0]
            },
                "type": "connection_init"
            }
            })
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me Added ${findChannelEmote.name} to chat from ${args[1]}`)
            } else {
                return {
                    text: `Added ${findChannelEmote.name} to chat from ${args[1]}`
                    }
            }
        }
                } else {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        return client.privmsg(message.channelName, `.me ${args[0]} not found in ${args[1]}`)
                    } else {
                        return {
                            text: `${args[0]} not found in ${args[1]}`
                        }
                    }
                }
            }
            const { body: STVEmoteSearch } = await got.post(`https://7tv.io/v3/gql`, { 
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                "operationName": "SearchEmotes",
                "query": "query SearchEmotes($query: String!, $page: Int, $limit: Int) {\n  emotes(query: $query, page: $page, limit: $limit) {\n    count\n    items {\n      id\n      name\n      listed\n      owner {\n        id\n        username\n        display_name\n        tag_color\n        __typename\n      }\n      flags\n      images {\n        name\n        format\n        url\n        width\n        height\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
                "variables": {
                    limit: 1000,
                    query: args[0]
                    }
                }
            })
            const findEmote = STVEmoteSearch.data.emotes.items.find(emote => emote.name === args[0]);
            if (!findEmote) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    return client.privmsg(message.channelName, `.me Could not find emote ${args[0]} XD`)
                } else {
                    return {
                        text: `Could not find emote ${args[0]} XD`
                    }
                }
            } else  {
                const xd = await api.fetchUser(`${message.channelName}`);
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
                    "emote_id": findEmote.id,
                            "id": xd.id,
                },
                "type": "connection_init"
            }
        })
        if (message.senderUsername == await utils.PoroNumberOne()) {
            return client.privmsg(message.channelName, `.me Added ${findEmote.name} to chat`)
        } else {
            return {
                text: `Added ${findEmote.name} to chat`
            }
        }
        } 

        } else {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me Please grant @DontAddThisBot as a editor :)`)
            } else {
                return {
                    text: `Please grant @DontAddThisBot as a editor :)`
                }
            }
        }   
    } else {
        if (message.senderUsername == await utils.PoroNumberOne()) {
            return client.privmsg(message.channelName, `.me ur not editor in ${message.channelName}!!!`)
        } else {
            return {
                text: `ur not editor in ${message.channelName}!!!`
            }
        }
    }
} 
}


