const got = require("got");

module.exports = {  
    name: "firstline",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/logs/firstmessage/${targetChannel}/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)

        if (userData.status == 404) {
            return {
                text: 'Invalid Channel PoroSad or opted out cmonBruh'
            }
        } else {
            const message = userData.message
            const time = userData.time
            return {
                text: `Your first message in ${targetChannel} is "${message}" ${time} ago BatChest`
            }
        }
    },
};