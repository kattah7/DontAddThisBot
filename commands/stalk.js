const got = require("got");

module.exports = {
    name: "stalk",
    aliases: [],
    cooldown: 3000,
    description: "stalk someone",
    execute: async (message, args) => {
        
        const targetUser =  args[1] ?? message.senderUsername
        const { chatters } = await got(`https://tmi.twitch.tv/group/user/${(targetUser.toLowerCase())}/chatters`).json();
        console.log(chatters)
        if ([...chatters.broadcaster, ...chatters.moderators, ...chatters.vips, ...chatters.viewers].includes(args[0].toLowerCase())) {
            return {
                text: `${args[0]} is currently in ${targetUser}'s viewerlist ✅`
            }
        } else {
            return {
                text: `${args[0]} is not in ${targetUser}'s viewerlist ❌`
            }
        }
    }
};