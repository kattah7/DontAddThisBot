const got = require("got");
const humanizeDuration = require("./humanizeDuration");

module.exports = {
    name: "isafk",
    aliases: [],
    cooldown: 3000,
    description: "Checks if user is AFK with SupiBot",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://supinic.com/api/bot/afk/check?username=${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });

        //Check if statusCode is 200, if not, return a message saying that something went wrong
        if (statusCode !== 200) {
            return {
                text: "Something went wrong with the request.",
            };
        }

        const afkStatus = userData.data.status;
        const STATUS = afkStatus.status;
        

        //If there is no afk status, return a message saying that the user is not afk
        if (!afkStatus) {
            return {
                text: `${targetUser} is not AFK. FeelsDankMan`,
            };
            // else return a message saying that the user is afk
        } else if (STATUS == 'afk') {
            console.log(afkStatus);
            const ms = new Date().getTime() - Date.parse(afkStatus.started);
            return {
                text: `${targetUser} went AFK ${humanizeDuration(ms)} ago BatChest Reason: ${afkStatus.text}`,
            };
        } else { 
            console.log(afkStatus);
            const ms = new Date().getTime() - Date.parse(afkStatus.started);
            const STATUS = afkStatus.status
            return {
                text: `${targetUser} went AFK(${STATUS}) ${humanizeDuration(ms)} ago BatChest Reason: ${afkStatus.text}`,
            }
        }
    },
};