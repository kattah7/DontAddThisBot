const got = require("got");

module.exports = {
    name: "kekw",
    aliases: [],
    cooldown: 3000,
    description: "lol",
    execute: async (message, args) => {
        const subArray = [];
        const { chatters } = await got(`https://tmi.twitch.tv/group/user/${message.channelName}/chatters`).json();
        console.log(chatters)
        for (const user of [...chatters.broadcaster, ...chatters.moderators, ...chatters.vips, ...chatters.viewers]) {
            const { hidden, subscribed } = await got(`https://api.ivr.fi/twitch/subage/${encodeURIComponent(user)}/${message.channelName}}`, { throwHttpErrors: false, timeout: 3000 }).json();
            if (!hidden && subscribed) subArray.push(user);
            console.log(subscribed)
        }

        return { text: `Out of ${[...chatters.broadcaster, ...chatters.moderators, ...chatters.vips, ...chatters.viewers].length} users, ${subArray.length} are subscribed to ${message.channelName}` };
    },
};