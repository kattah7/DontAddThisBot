const got = require("got");

module.exports = {
    name: "forsentest",
    aliases: [],
    cooldown: 3000,
    description:"Gets the top clip of the channel",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername
        const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': ""}}).json();
        console.log(banned, banphrase_data)
        
        

    },
};