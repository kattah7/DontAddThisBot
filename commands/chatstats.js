const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "chatstats",
    aliases: [],
    cooldown: 3000,
    description:"",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.streamelements.com/kappa/v2/chatstats/${targetUser}/stats`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData);
        
        if (userData.statusCode == 404) {
            return {
                text: `Channel doesn't exist :p maybe try using old name?`
            }
        } else {
            return {
                text: `Total ${userData.totalMessages} MESSAGES, Top Chatter: ${userData.chatters[0].name} Amount: ${userData.chatters[0].amount}, Top BTTV Emote: ${userData.bttvEmotes[0].emote} used ${userData.bttvEmotes[0].amount} times, Top FFZ Emote: ${userData.ffzEmotes[0].emote} used ${userData.ffzEmotes[0].amount}, Top TWITCH Emote: ${userData.twitchEmotes[0].emote} used ${userData.twitchEmotes[0].amount}. Top Hastag: ${userData.hashtags[0].hashtag} used ${userData.hashtags[0].amount} times, Top command ${userData.commands[0].command} used ${userData.commands[0].amount} times :O`
            } 
        }
        
    },
};