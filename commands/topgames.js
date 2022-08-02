const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'topgames',
    aliases: [],
    cooldown: 3000,
    description: 'Live playercount of top games on steam',
    execute: async (message, args, client) => {
        const id = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(
            `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?appid=1599340`,
            { timeout: 10000, throwHttpErrors: false, responseType: 'json' }
        );
        //console.log(userData)
        let { body: userData2, statusCode2 } = await got(
            `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?appid=730`,
            { timeout: 10000, throwHttpErrors: false, responseType: 'json' }
        );
        //console.log(userData2)
        let { body: userData3, statusCode3 } = await got(
            `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?appid=570`,
            { timeout: 10000, throwHttpErrors: false, responseType: 'json' }
        );
        //console.log(userData3)

        const data1 = userData.response.player_count;
        const data2 = userData2.response.player_count;
        const data3 = userData3.response.player_count;

        if (message.senderUsername == (await utils.PoroNumberOne())) {
            client.privmsg(
                message.channelName,
                `.me TOP STEAM GAMES BatChest Lost Ark: ${data1} players :o CS:GO: ${data2} players :o Dota 2: ${data3} players :o`
            );
        } else {
            return {
                text: `TOP STEAM GAMES BatChest Lost Ark: ${data1} players :o CS:GO: ${data2} players :o Dota 2: ${data3} players :o`,
            };
        }
    },
};
