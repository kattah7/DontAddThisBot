const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'robloxgame',
    aliases: [],
    cooldown: 3000,
    description: 'Gets information of a roblox game, please use Place ID',
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName;
        let { body: userData, statusCode } = await got(
            `https://api.roblox.com/universes/get-universe-containing-place?placeid=${targetUser}`,
            { timeout: 10000, throwHttpErrors: false, responseType: 'json' }
        );

        const universe = userData.UniverseId;

        let { body: data1 } = await got(`https://games.roblox.com/v1/games?universeIds=${universe}`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        //console.log(data1)
        const name = data1.data[0].name;
        const playing = data1.data[0].playing;
        const visit = data1.data[0].visits;
        const favorite = data1.data[0].favoritedCount;
        if (message.senderUsername == (await utils.PoroNumberOne())) {
            client.privmsg(
                message.channelName,
                `.me ${name} currently has ${playing} PLAYERS, ${visit} total visits and favorited by ${favorite} Players. CREATED: ${
                    data1.data[0].created.split('T')[0]
                }, LAST UPDATED: ${data1.data[0].updated.split('T')[0]} LuL`
            );
        } else {
            return {
                text: `${name} currently has ${playing} PLAYERS, ${visit} total visits and favorited by ${favorite} Players. CREATED: ${
                    data1.data[0].created.split('T')[0]
                }, LAST UPDATED: ${data1.data[0].updated.split('T')[0]} LuL`,
            };
        }
    },
};
