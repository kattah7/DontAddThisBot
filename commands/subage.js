const got = require("got");

module.exports = {
    name: "subage",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let userData = await got(`https://api.ivr.fi/twitch/subage/${targetUser}/${targetChannel}`, { timeout: 10000}).json();
        console.log(userData);

        if (userData.subscribed) {
            const months = userData.cumulative.months
            return {
                text: `${targetUser} is currently subbed to ${targetChannel} for ${(months)} months BatChest`,
            };
        } else {
            const months = userData.cumulative.months
            return {
                text: `${targetUser} was previously subbed for ${(months)} months PoroSad`,
            }
        }
        
    },
};