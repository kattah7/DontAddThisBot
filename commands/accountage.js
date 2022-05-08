const got = require("got");
const humanizeDuration = require("./humanizeDuration");

module.exports = {
    name: "accage",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let userData = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000}).json();
        console.log(userData)
        
        if (userData.code  == 'ERR_NON_2XX_3XX_RESPONSE') {
            return {
                text: `Account doesnt exist PoroSad`,
            }

        } else {
            const date = (userData.createdAt);
            return {
                text: `${message.senderUsername}, ${(date.split("T")[0] )} BatChest`,
            }
        }  
    },
};