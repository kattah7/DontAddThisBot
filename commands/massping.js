const got = require("got");

module.exports = {
    name: "massping",
    aliases: [],
    cooldown: 3000,
    description:":tf:",
    execute: async (message, args, client) => {
        if (message.senderUsername !== "kattah") return;
        const { chatters } = await got(`https://tmi.twitch.tv/group/user/${message.channelName}/chatters`).json();
        for (const chatter of [...chatters.broadcaster, ...chatters.moderators, ...chatters.vips, ...chatters.viewers]) {
            client.say(message.channelName, `${chatter} ${args.join(" ")}`);
        }
    },
};