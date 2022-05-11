const got = require("got");

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

        //If there is no afk status, return a message saying that the user is not afk
        if (!afkStatus) {
            return {
                text: "User is not AFK. FeelsDankMan",
            };
            // else return a message saying that the user is afk
        } else {
            console.log(afkStatus);
            return {
                text: `${targetUser} went AFK at ${afkStatus.started.split("T")[0]} BatChest Reason: ${afkStatus.text}`,
            };
        }
    },
};