const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'searchgame',
    aliases: [],
    cooldown: 3000,
    description: 'Gets live playercount of a steam game, Please use APP ID',
    execute: async (message, args, client) => {
        const id = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(
            `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?appid=${id}`,
            { timeout: 10000, throwHttpErrors: false, responseType: 'json' }
        );
        //console.log(userData)

        const data = userData.response.player_count;
        const result = userData.response.result;

        if (result == 42) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(message.channelName, `.me Game doesnt not exist :) Please use |search "Game" App ID`);
            } else {
                return {
                    text: `Game doesnt not exist :) Please use |search "Game" App ID`,
                };
            }
        } else {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(message.channelName, `.me Currently has ${data} players :O`);
            } else {
                return {
                    text: `Currently has ${data} players :O`,
                };
            }
        }
    },
};
