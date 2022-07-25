const got = require("got");

module.exports = {
    name: "massping",
    aliases: [],
    cooldown: 3000,
    permission: 2,
    description:":tf:",
    botPerms: "vip",
    execute: async (message, args, client) => {
        const { chatters } = await got(`https://tmi.twitch.tv/group/user/${message.channelName}/chatters`).json();
        for (const chatter of [...chatters.broadcaster, ...chatters.moderators, ...chatters.vips, ...chatters.viewers]) {
            client.say(message.channelName, `${chatter} ${args.join(" ")}`);
        }
    },
};