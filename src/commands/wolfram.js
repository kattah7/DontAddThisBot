const got = require('got');

module.exports = {
    name: 'wolfram',
    aliases: ['query'],
    cooldown: 3000,
    description: 'search anything and get a answer',
    execute: async (message, args, client) => {
        let { body: userData, statusCode } = await got(
            `https://api.wolframalpha.com/v1/conversation.jsp?appid=${
                process.env.WOLFRAM_APP_ID
            }&i=${encodeURIComponent(args.join(' '))}`,
            { timeout: 10000, throwHttpErrors: false, responseType: 'json' }
        );
        //console.log(userData)
        return {
            text: `${message.senderUsername}, ${userData.result}`,
        };
    },
};
