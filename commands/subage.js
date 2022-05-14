const got = require("got");

module.exports = {
    name: "subage",
    aliases: ["sa"],
    cooldown: 3000,
    description:"Checks a subcribed age of a user",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let userData = await got(`https://api.ivr.fi/twitch/subage/${targetUser}/${targetChannel}`, { timeout: 10000}).json();
        console.log(userData);

        if (userData.subscribed == false) {
            if (userData.cumulative.months == 0) {
                return {
                    text: `${targetUser} has never subbed to ${targetChannel} before. D:`
                }
            } else if (userData.cumulative.months > 0) {
                return {
                    text: `${targetUser} was previously subbed to ${targetChannel} for ${userData.cumulative.months} months. Expired at ${userData.cumulative.end.split("T")[0]} PoroSad`
                }
            }
        } else if (userData.subscribed == true) {
            if (userData.meta.gift == null) {
                return {
                    text: `${targetUser} is currently subbed to ${targetChannel} for ${userData.cumulative.months} months with a tier ${userData.meta.tier} ${userData.meta.type} sub. [Renews: ${userData.cumulative.end.split("T")[0]} / Expires: ${userData.meta.endsAt.split("T")[0]}] B)`
                } 
            } else if (userData.meta.gift.isgift == true) {
                return {
                    text: `${targetUser} is currently gifted tier ${userData.meta.tier}, ${userData.cumulative.months} month sub to ${targetChannel} by ${userData.meta.gift.name}. [Renews: ${userData.cumulative.end.split("T")[0]} / Expires: ${userData.meta.endsAt.split("T")[0]}] HolidayPresent`
                }
            }
        } 
        
    },
};