const got = require("got");

module.exports = {
    name: "subage",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let userData = await got(`https://api.ivr.fi/twitch/subage/${targetUser}/${message.channelName}`, { timeout: 10000}).json();
        console.log(userData);

        if (userData.subscribed) {
            const months = userData.cumulative.months
            return {
                text: `${message.senderUsername}, Is currently subbed for ${(months)} months BatChest`,
            };
        } else {
            const months = userData.cumulative.months
            return {
                text: `${message.senderUsername}, Previously subbed for ${(months)} months PoroSad`,
            }
        }
        
    },
};