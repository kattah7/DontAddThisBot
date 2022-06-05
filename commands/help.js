const got = require("got");

module.exports = {
    name: "help",
    cooldown: 10000,
    poro: true,
    description: 'Bot help',
    execute: async(message, args, client) => {
        const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': message.senderUsername}}).json();
        console.log(banned, banphrase_data)
        if (banned == false) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                return client.privmsg(message.channelName, `.me ${message.senderUsername}, Check the bot's panels for more info kattahAroundTheWorld`)
            } else {
                return {
                    text: `${message.senderUsername}, Check the bot's panels for more info kattahAroundTheWorld`
                }
            }
        } else if (banned == true) {
            return {
                text: `banned msg lol`
            }
        }
    }
}