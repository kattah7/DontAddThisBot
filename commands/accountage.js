const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "accage",
    aliases: [],
    cooldown: 3000,
    description: "Check account age of a user or yourself",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername
        let userData = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000}).json();
        console.log(userData)

        const date = (userData.createdAt);
        if (userData.banned == true) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                return client.privmsg(message.channelName, `.me ${targetUser}'s accage ${(date.split("T")[0] )} BatChest ❌`)
            }
            return {
                text: `${targetUser}'s accage ${(date.split("T")[0] )} BatChest ❌`,
            }

        } else {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                return client.privmsg(message.channelName, `.me ${targetUser}'s accage ${(date.split("T")[0] )} BatChest`)
            }
            return {
                text: `${targetUser}'s accage ${(date.split("T")[0] )} BatChest`,
            }
        }  
    },
};