const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "test",
    aliases: [],
    cooldown: 3000,
    description:"",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let userData = await got(`https://api.streamelements.com/kappa/v2/chatstats/${targetUser}/stats`, { timeout: 10000}).json();
        console.log(userData);
        
        return {
            text: `This channel has total of ${userData.totalMessages} messages`
        }
        
    },
};