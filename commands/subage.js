const got = require("got");

module.exports = {
    name: "subage",
    aliases: [],
    cooldown: 3000,
    description:"Checks a subcribed age of a user",
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
        } else if (userData.cumulative.months == 0) {
            
            return {
                text: `${targetUser} was never subbed to ${targetChannel}`,
            }
        } else if (userData.cumulative.months > 0) {
            const months = userData.cumulative.months

            return {
                text: `${targetUser} has been subbed to ${targetChannel} for ${months}`
            }
        }
        
    },
};