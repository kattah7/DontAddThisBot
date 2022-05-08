const got = require("got");
const humanizeDuration = require("./humanizeDuration");

module.exports = {
    name: "followage",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        let userData = await got(`https://api.ivr.fi/twitch/subage/${message.senderUsername}/${message.channelName}`, { timeout: 10000}).json();
        console.log(userData);

        if (userData.followedAt) {
            const ms = new Date().getTime() - Date.parse(userData.followedAt);
            return {
                text: `${message.senderUsername}, has been following for ${humanizeDuration(ms)} BatChest`,
            };
        } else {
            return {
                text: `${message.senderUsername}, is not following PoroSad`,
            }
        }
        
    },
};