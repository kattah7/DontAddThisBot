const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    tags: '7tv',
    name: '7tvemote',
    cooldown: 3000,
    description: 'Check 7tv emote info',
    stvOnly: true,
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `Please insert a emote :)`,
            };
        }
        var reg = /^[a-z]+$/i;
        if (!reg.test(args[0])) {
            return {
                text: `Invalid emote :)`,
            };
        }
        const { body: STVEmotesInChannel, error } = await got.post(`https://7tv.io/v3/gql`, {
            // find emotes
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                operationName: 'WatchEmoteSetMin',
                query: 'subscription WatchEmoteSetMin($id: ObjectID!, $init: Boolean) {\n  emoteSet(id: $id, init: $init) {\n    id\n    name\n    capacity\n    emotes {\n      id\n      name\n      __typename\n    }\n    owner {\n      id\n      display_name\n      tag_color\n      avatar_url\n      __typename\n    }\n    __typename\n  }\n}',
                variables: {
                    id: await utils.stvNameToID(message.channelID),
                    init: true,
                },
            },
        });
        //console.log(STVEmotesInChannel)
        const findThatEmote = STVEmotesInChannel.data.emoteSet.emotes.find((emote) => emote.name === args[0]);
        if (findThatEmote) {
            const { body: STVEmoteDate } = await got.post(`https://7tv.io/v3/gql`, {
                throwHttpErrors: false,
                responseType: 'json',
                json: {
                    operationName: 'Emote',
                    query: 'query Emote($id: ObjectID!) {\n  emote(id: $id) {\n    id\n    created_at\n    name\n    lifecycle\n    owner {\n      id\n      username\n      display_name\n      avatar_url\n      tag_color\n      __typename\n    }\n    flags\n    versions {\n      id\n      name\n      description\n      created_at\n      lifecycle\n      images {\n        name\n        format\n        url\n        width\n        height\n        __typename\n      }\n      __typename\n    }\n    animated\n    __typename\n  }\n}',
                    variables: {
                        id: findThatEmote.id,
                    },
                },
            });
            const { body: STVEmoteUsers } = await got.post(`https://7tv.io/v3/gql`, {
                throwHttpErrors: false,
                responseType: 'json',
                json: {
                    operationName: 'GetEmoteChannels',
                    query: 'query GetEmoteChannels($id: ObjectID!, $page: Int, $limit: Int) {\n  emote(id: $id) {\n    id\n    channels(page: $page, limit: $limit) {\n      total\n      items {\n        id\n        username\n        display_name\n        avatar_url\n        tag_color\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
                    variables: {
                        id: findThatEmote.id,
                    },
                },
            });
            // console.log(STVEmoteDate, STVEmoteUsers)
            const emoteOwner = STVEmoteDate.data.emote.owner.display_name;
            const emoteDate = STVEmoteDate.data.emote.created_at.split('T')[0];
            const emoteUsers = STVEmoteUsers.data.emote.channels.total.toLocaleString();
            return {
                text: `Emote ${args[0]} by ${emoteOwner} | Created at: ${emoteDate} | Enabled users: ${emoteUsers} 7tvM YEAHBUT7TV https://7tv.app/emotes/${findThatEmote.id}`,
            };
        } else {
            const { body: STVEmoteSearch } = await got.post(`https://7tv.io/v3/gql`, {
                throwHttpErrors: false,
                responseType: 'json',
                json: {
                    operationName: 'SearchEmotes',
                    query: 'query SearchEmotes($query: String!, $page: Int, $limit: Int) {\n  emotes(query: $query, page: $page, limit: $limit) {\n    count\n    items {\n      id\n      name\n      listed\n      owner {\n        id\n        username\n        display_name\n        tag_color\n        __typename\n      }\n      flags\n      images {\n        name\n        format\n        url\n        width\n        height\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
                    variables: {
                        limit: 1000,
                        query: args[0],
                    },
                },
            });
            //console.log(STVEmoteSearch, STVEmoteSearch.data.emotes.items)
            const findEmoteBySearch = STVEmoteSearch.data.emotes.items.find((emote) => emote.name === args[0]);
            if (!findEmoteBySearch) {
                return {
                    text: `Emote ${args[0]} not found :p check spelling or caps maybe?`,
                };
            }
            const { body: STVEmoteDate } = await got.post(`https://7tv.io/v3/gql`, {
                throwHttpErrors: false,
                responseType: 'json',
                json: {
                    operationName: 'Emote',
                    query: 'query Emote($id: ObjectID!) {\n  emote(id: $id) {\n    id\n    created_at\n    name\n    lifecycle\n    owner {\n      id\n      username\n      display_name\n      avatar_url\n      tag_color\n      __typename\n    }\n    flags\n    versions {\n      id\n      name\n      description\n      created_at\n      lifecycle\n      images {\n        name\n        format\n        url\n        width\n        height\n        __typename\n      }\n      __typename\n    }\n    animated\n    __typename\n  }\n}',
                    variables: {
                        id: findEmoteBySearch.id,
                    },
                },
            });
            const { body: STVEmoteUsers } = await got.post(`https://7tv.io/v3/gql`, {
                throwHttpErrors: false,
                responseType: 'json',
                json: {
                    operationName: 'GetEmoteChannels',
                    query: 'query GetEmoteChannels($id: ObjectID!, $page: Int, $limit: Int) {\n  emote(id: $id) {\n    id\n    channels(page: $page, limit: $limit) {\n      total\n      items {\n        id\n        username\n        display_name\n        avatar_url\n        tag_color\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
                    variables: {
                        id: findEmoteBySearch.id,
                    },
                },
            });
            //console.log(STVEmoteUsers, STVEmoteUsers.data.emote.channels)
            const emoteOwner = STVEmoteDate.data.emote.owner.display_name;
            const emoteDate = STVEmoteDate.data.emote.created_at.split('T')[0];
            const emoteUsers = STVEmoteUsers.data.emote.channels.total.toLocaleString();
            return {
                text: `Emote ${args[0]} by ${emoteOwner} | Created at: ${emoteDate} | Enabled users: ${emoteUsers} 7tvM YEAHBUT7TV https://7tv.app/emotes/${findEmoteBySearch.id}`,
            };
        }
    },
};
