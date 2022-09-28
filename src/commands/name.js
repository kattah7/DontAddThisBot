const axios = require('axios');
const utils = require('../util/utils.js');

module.exports = {
    tags: 'stats',
    name: 'name',
    cooldown: 3000,
    description: 'Check available names on Twitch',
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0] ?? message.senderUsername);
        if (!/^[a-z0-9_]/i.test(targetUser)) {
            return {
                text: `${targetUser} is not a valid user`,
            };
        }
        const name = await axios
            .get(`https://api.fuchsty.com/twitch/checkname?username=${targetUser}`)
            .then((res) => res.data[0]);

        if (name.available) {
            return {
                text: `${targetUser} is available! PogBones`,
            };
        } else {
            return {
                text: `${targetUser} is not available! ⛔`,
            };
        }
    },
};
