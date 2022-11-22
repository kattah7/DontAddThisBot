const got = require('got');
const utils = require('../util/utils.js');
const { GetAllEmoteSets } = require('../token/stvGQL.js');

module.exports = {
    tags: '7tv',
    name: '7tv',
    cooldown: 5000,
    description: "Check user's 7tv info YEAHBUT7TV",
    stvOnly: true,
    execute: async (message, args, client) => {
        if (!/^[A-Z_\d]{2,26}$/i.test(args[0])) {
            return {
                text: 'malformed username parameter',
            };
        }

        const targetUser = await utils.ParseUser(args[0] ?? message.senderUsername);
        const UID = await utils.IDByLogin(targetUser);
        const { body: STVInfo } = await got.post(`https://7tv.io/v3/gql`, {
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                operationName: 'GetUser',
                variables: {
                    id: await utils.stvNameToID(UID),
                },
                query: 'query GetUser($id: ObjectID!) {\n  user(id: $id) {\n    id\n    username\n    display_name\n    created_at\n    avatar_url\n    style {\n      color\n      __typename\n    }\n    biography\n    editors {\n      id\n      permissions\n      visible\n      user {\n        id\n        username\n        display_name\n        avatar_url\n        style {\n          color\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    roles\n    connections {\n      id\n      username\n      display_name\n      platform\n      linked_at\n      emote_capacity\n      emote_set_id\n      __typename\n    }\n    __typename\n  }\n}',
            },
        });

        if (STVInfo.data == null) {
            return {
                text: `"${targetUser}" is not a valid username`,
            };
        } else {
            const globalRoles = await utils.STVGlobalRoles();
            const { id, created_at, editors, connections, roles } = STVInfo.data.user;
            const isDiscordLinked = connections.find((connection) => connection.platform == 'DISCORD');
            const ifDiscordLinked = isDiscordLinked
                ? `${isDiscordLinked.display_name} Linked Date: ${isDiscordLinked.linked_at.split('T')[0]}`
                : false;
            const { data } = await GetAllEmoteSets(id);
            const { emotes, capacity } = data.user.emote_sets[0];
            const userRole = globalRoles.roles.find((role) => role.id == roles[0]);
            return {
                text: `7tvM ${targetUser}, User ID: ${id} | Registered: ${created_at.split('T')[0]} | Editors: ${
                    editors.length
                } | Slots: ${emotes.length}/${capacity} | Roles: ${userRole.name} | Discord Linked: ${ifDiscordLinked}`,
            };
        }
    },
};
