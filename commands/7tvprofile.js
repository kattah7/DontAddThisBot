const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: '7tv',
    cooldown: 1000,
    description: "Check user's 7tv info YEAHBUT7TV",
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0] ?? message.senderUsername)
        const { body: STVInfo } = await got.post(`https://7tv.io/v3/gql`, {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                Authorization: process.env.STV_AUTH,
            },
            json: {
                operationName: 'GetUser',
                variables: {
                    id: await utils.stvNameToID(targetUser),
                },
                query: 'query GetUser($id: ObjectID!) {\n  user(id: $id) {\n    ...USER_FRAGMENT\n    __typename\n  }\n}\n\nfragment USER_FRAGMENT on User {\n  id\n  username\n  display_name\n  created_at\n  avatar_url\n  tag_color\n  biography\n  editors {\n    user {\n      id\n      username\n      display_name\n      avatar_url\n      tag_color\n      __typename\n    }\n    __typename\n  }\n  roles\n  emote_sets {\n    id\n    name\n    capacity\n    emotes {\n      id\n      name\n      emote {\n        id\n        name\n        lifecycle\n        flags\n        listed\n        images(formats: [WEBP]) {\n          name\n          format\n          url\n          __typename\n        }\n        owner {\n          id\n          display_name\n          tag_color\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    owner {\n      id\n      display_name\n      tag_color\n      avatar_url\n      __typename\n    }\n    __typename\n  }\n  connections {\n    id\n    display_name\n    platform\n    linked_at\n    emote_slots\n    emote_set_id\n    __typename\n  }\n  owned_emotes {\n    id\n    name\n    images(formats: [WEBP]) {\n      name\n      format\n      url\n      __typename\n    }\n    listed\n    __typename\n  }\n  __typename\n}',
            },
        });
        if (STVInfo.data == null) {
            return {
                text: `"${targetUser}" is not a valid username`,
            }
        } else {
            const ID = STVInfo.data.user.id
            const joinedAt = STVInfo.data.user.created_at
            const editorCount = STVInfo.data.user.editors.length
            const emoteSets = STVInfo.data.user.emote_sets.length
            return {
                text: `7tvM ${targetUser}: ${ID} | ${joinedAt.split("T")[0]} | Editors: ${editorCount} | Emote Sets: ${emoteSets}`,
            } 
        }
    },
};
