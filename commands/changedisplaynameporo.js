const got = require('got')

module.exports = {
    name: 'changename',
    description: "Change the bot's name",
    cooldown: 10000,
    aliases: [],
    async execute(message, args, client) {
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        const reg=/^[a-zA-Z]{14}$/i;
        if (!args[0]) {
            return {
                text: `put a display name lol`
            }
        } 
         if (!/^[dontaddthisbot]{14}$/i.test(args[0])) {
            return {
                text: `you can only change the display name`
            }
        }
        if (channelData.poroCount < 50) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                return client.privmsg(message.channelName, `.me Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | ${channelData.poroCount} meat total! 🥩`)
            }
            return {
                text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | ${channelData.poroCount} meat total! 🥩`
            }
        } else {
            await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount - 50 } } ).exec();
            const query = []
            query.push({
                "operationName": "UpdateUserProfile",
                "variables": {
                    "input": {
                        "description": "Bot made by @Kattah, huge thanks to @Fookstee for contribution",
                        "displayName": `${args[0]}`,
                        "userID": "790623318",
                    }
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "991718a69ef28e681c33f7e1b26cf4a33a2a100d0c7cf26fbff4e2c0a26d15f2"
                    }
                }
            })

        got.post('https://gql.twitch.tv/gql', {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
            },
            json: query
        })
        if (message.senderUsername == process.env.NUMBER_ONE) {
            return client.privmsg(message.channelName, `.me Name Changed! PoroSad ${channelData.poroCount - 50} meat total! 🥩`)
        } else {
            return {
                text:`Nmae Changed! PoroSad ${channelData.poroCount - 50} meat total! 🥩`
            }
        }
        }
    },
};