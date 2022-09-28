const got = require('got');

module.exports = {
    tags: 'stats',
    name: 'color',
    cooldown: 3000,
    description: "Gets user's chat color",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        //console.log(userData)
        const color = userData.chatColor;
        if (color == null) {
            return {
                text: `${message.senderUsername}, ${targetUser} has never changed their name color WutFace`,
            };
        }
        const colorName = await got(`https://www.thecolorapi.com/id?hex=${color.replace('#', '')}`).json();
        //console.log(colorName)
        return {
            text: `${message.senderUsername}, ${color} (${colorName.name.value}) KappaPride`,
        };
    },
};
