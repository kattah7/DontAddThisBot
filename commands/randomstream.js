const got = require("got");
const humanizeDuration = require("../humanizeDuration");
const regex = require('../util/regex.js');
const utils = require("../util/utils.js");

module.exports = {
    name: "randomstream",
    aliases: ["rs"],
    cooldown: 5000,
    description:"Fetches a random streamer from any game category",
    execute: async (message, args, client) => {
        if (!args[0]) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me Pls write a category lol`)
            } else {
                return {
                    text: `Pls write a category lol`
                } 
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

        if (!regex.racism.test(random.title)) {
            if (args[0].toLowerCase()) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me ${random.user_name} been live for ${humanizeDuration(ms)} playing ${random.game_name} with ${random.viewer_count} viewers. Title: ${random.title}. twitch.tv/${random.user_login} kattahSpin`)
                } else {
                    return {
                        text: `${random.user_name} been live for ${humanizeDuration(ms)} playing ${random.game_name} with ${random.viewer_count} viewers. Title: ${random.title}. twitch.tv/${random.user_login} kattahSpin`
                    }
                }
            }
        } else {
            const XD = 'https://discord.com/api/webhooks/987735146297962497/Kvhez5MjG5Y-XiYQo9EUGbhiVd6UODyOf58WjkAZwRQMglOX_cpiW436mXZLLD8T7oFA'
        const msg2 = {
            embeds: [{
                color: 0x0099ff,
                title: `Sent by ${message.senderUsername}(UID:${message.senderUserID}) in #${message.channelName}`,
                author: {
                    name: 'racist detected',
                    icon_url: 'https://i.nuuls.com/g8l2r.png',
                },
                description: `${args.join(" ")}`,
                timestamp: new Date(),
                footer: {
                    text: 'Pulled time',
                    icon_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
                }
            }]
        }
        fetch(XD + "?wait=true", 
        {"method":"POST", 
        "headers": {"content-type": "application/json"},
        "body": JSON.stringify(msg2)})
        .then(a=>a.json()).then(console.log)
            return {
                text: "That message violates the terms of service."
            }
        }
            

    },
};
