const got = require("got");
const utils = require("../util/utils.js");

module.exports = {
    name: "suggest",
    aliases: ["suggestion"],
    cooldown: 5000,
    description: "Suggestion to the bot",
    execute: async (message, args, client) => {
        if (args.length < 1) return { text: "Usage: |suggest <suggestion>" };
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${message.senderUsername}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        const pfp = userData.logo;
        const XD = 'https://discord.com/api/webhooks/987635741523869757/MyyRLZ6MV-GSLjuzHEU2JJ5fyWcimcFiT_NGiLRfp-ibv5KpUF2kzHH-kNDgfHfU1leY'
        const KEKW = {
            embeds: [{
            color: 0x0099ff,
            title: `Sent by ${message.senderUsername} in #${message.channelName}`,
            author: {
                name: 'New suggestion',
                icon_url: 'https://i.nuuls.com/nRGtC.png',
            },
            description: `${args.join(" ")}`,
            thumbnail: {
                url: `${pfp}`,
            },
            timestamp: new Date(),
            footer: {
                text: 'Pulled time',
                icon_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
            }
        }]
    }
        fetch(XD + "?wait=true", 
        {method:"POST", 
        headers: {"content-type": "application/json"},
        body: JSON.stringify(KEKW)})
        .then(a=>a.json()).then(console.log)
        if (message.senderUsername == await utils.PoroNumberOne()) {
            client.privmsg(message.channelName, `.me Suggestion sent! :)`)
        } else {
            return {
                text: `Suggestion sent! :)`
            }
        }
    }
}