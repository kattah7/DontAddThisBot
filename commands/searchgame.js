const got = require("got");

module.exports = {
    name: "searchgame",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args, client) => {
        const id = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?appid=${id}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)
        
        const data = userData.response.player_count
        const result = userData.response.result

        if (result == 42) {
            return {
                text: `Game doesnt not exist :) Please use |search "Game" App ID`
            } 
        } else {
            return {
                text: `Currently has ${data} players :O`
            }
        }
    },
};