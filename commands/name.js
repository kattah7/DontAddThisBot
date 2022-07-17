const got = require("got");
const regex = require('../util/regex.js');
const utils = require("../util/utils.js");

module.exports = {  
    name: "name",
    aliases: [],
    cooldown: 3000,
    description:"Check available names on Twitch",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://api.fuchsty.com/checkname/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        
        const available = (userData.available)

        if (!regex.racism.test(targetUser)) {
        if (userData == 400) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me ${targetUser} must start with an alphanumeric character.`)
            } else {
                return {
                    text: `${targetUser} must start with an alphanumeric character.`
                }
            }
        } else if (userData.available == false) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me "${targetUser}" username is not available. PoroSad`)
            } else {
                return {
                    text: `"${targetUser}" username is not available. PoroSad`
                }
            }
        } else if (userData.available == true) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me "${targetUser}" username is available. PogBones`)
            } else {
                return {
                    text: `"${targetUser}" username is available. PogBones`
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
        

    }
};