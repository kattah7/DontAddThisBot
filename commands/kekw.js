const got = require("got");

module.exports = {
    name: "kekw",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const subArray = [];
        const { chatters } = await got(`https://tmi.twitch.tv/group/user/${message.channelName}/chatters`).json();
        for (const user of [...chatters.broadcaster, ...chatters.moderators, ...chatters.vips, ...chatters.viewers]) {
            const { hidden, subscribed } = await got(`https://api.ivr.fi/twitch/subage/${encodeURIComponent(user)}/${args[0]}`, { throwHttpErrors: false, timeout: 3000 }).json();
            if (!hidden && subscribed) subArray.push(user);
        }

        return { text: `Out of ${chattersArray.length} users, ${subArray.length} are subscribed to zoil 😴 (${subArray.join(", ")})` };
    },
};