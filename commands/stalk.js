const got = require("got");

module.exports = {
    name: "stalk",
    aliases: [],
    cooldown: 3000,
    description: "stalk someone ImInYourWalls",
    execute: async (message, args, client) => {
        client.say(message.channelName, "This might take a bit ppBounce")
        
        const targetUser =  args[1] ?? message.senderUsername
        const { chatters } = await got(`https://tmi.twitch.tv/group/user/${(targetUser.toLowerCase())}/chatters`).json();
        console.log(chatters)
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/logs/lastmessage/${(targetUser.toLowerCase())}/${args[0]}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)
        if (userData.status == 404) {
            return {
                text: `Invalid channel or incorrect username.`
            }
        }
        if ([...chatters.broadcaster, ...chatters.moderators, ...chatters.vips, ...chatters.viewers].includes(args[0].toLowerCase())) {
            return {
                text: `${args[0]} is currently in ${targetUser}'s viewerlist ✅ Recently logged " ${userData.response} " ${userData.time} ago`
            }
        } else {
            return {
                text: `${args[0]} is not in ${targetUser}'s viewerlist ❌ Recently logged " ${userData.response} " ${userData.time} ago`
            }
        }
    }
};