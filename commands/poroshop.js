const got = require("got");

module.exports = {
    name: "poroshop",
    cooldown: 10000,
    description: "poro shop information to use poro meat",
    aliases: ["shop"],
    poro: true,
    execute: async(message, args, client) => {
        const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': message.senderUsername}}).json();
        console.log(banned, banphrase_data)
        if (banned == false) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${message.senderUsername}, kattahDance setcolor (50 🥩) | cdr (5 🥩) | change display name (50 🥩) | deactivate bot :tf: (1mill 🥩)`)
            } else {
                return {
                    text: `${message.senderUsername}, kattahDance setcolor (50 🥩) | cdr (5 🥩) | change display name (50 🥩) | deactivate bot :tf: (1mill 🥩)`
                } 
            }
        } else if (banned == true) {
            return {
                text: `banned msg lol`
            }
        }
    }
}