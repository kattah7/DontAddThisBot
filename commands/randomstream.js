const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "randomstream",
    aliases: ["rs"],
    cooldown: 3000,
    description:"Fetches a random streamer from any game category",
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `Pls write a category lol`
            } 
        }
        

        const { data } = await got(`https://api.twitch.tv/helix/games?name=${args.join(" ")}`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        }).json();

        const { data: data2 } = await got(`https://api.twitch.tv/helix/streams?first=100&game_id=${data[0].id}`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
            }).json();
            var random = data2[Math.floor(Math.random()*data2.length)];
            const ms = new Date().getTime() - Date.parse(random.started_at);
            if (args[0].toLowerCase()) {
                if (message.senderUsername == process.env.NUMBER_ONE) {
                    client.privmsg(message.channelName, `.me ${random.user_name} been live for ${humanizeDuration(ms)} playing ${random.game_name} with ${random.viewer_count} viewers. Title: ${random.title}. twitch.tv/${random.user_login}`)
                } else {
                    return {
                        text: `${random.user_name} been live for ${humanizeDuration(ms)} playing ${random.game_name} with ${random.viewer_count} viewers. Title: ${random.title}. twitch.tv/${random.user_login}`
                    }
                }
            }
            

    },
};
