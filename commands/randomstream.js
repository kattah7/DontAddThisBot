const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "randomstream",
    aliases: ["rs"],
    cooldown: 3000,
    description:"Fetches a random streamer from any game category",
    execute: async (message, args, client) => {
        

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
            console.log(data2)
            const random = Math.floor(Math.random() * 100) + 0;
            const ms = new Date().getTime() - Date.parse(data2[random].started_at);
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${data2[random].user_name} been live for ${humanizeDuration(ms)} playing ${data2[random].game_name} with ${data2[random].viewer_count} viewers. Title: ${data2[random].title}. twitch.tv/${data2[random].user_login}`)
            } else {
                return {
                    text: `${data2[random].user_name} been live for ${humanizeDuration(ms)} playing ${data2[random].game_name} with ${data2[random].viewer_count} viewers. Title: ${data2[random].title}. twitch.tv/${data2[random].user_login}`
                }
            }

    },
};
