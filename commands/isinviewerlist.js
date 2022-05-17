const got = require("got");

module.exports = {
    name: "isinviewerlist",
    aliases: [],
    cooldown: 3000,
    description: "lol",
    execute: async (message, args) => {
        const { chatters } = await got(`https://tmi.twitch.tv/group/user/pokimane/chatters`).json();
        console.log(chatters)
        if ([...chatters.broadcaster, ...chatters.moderators, ...chatters.vips, ...chatters.viewers].includes("kattah")) {
            return {
                text: `xd`
            }
        } 
    }
};