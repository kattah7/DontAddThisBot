const got = require('got');

module.exports = {
    name: "test",
    description: "test",
    execute: async(message, args, client) => {
        const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': args[0] || message.senderUsername}}).json();
        console.log(banned, banphrase_data)
    }
}