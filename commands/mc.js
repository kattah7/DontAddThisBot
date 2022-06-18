const got = require("got");
const regex = require('../util/regex.js');

module.exports = {  
    name: "mc",
    aliases: [],
    cooldown: 3000,
    description:"Gets user's minecraft account age and first name",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://api.mojang.com/users/profiles/minecraft/${targetUser}?at=0`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });

        const id = (userData.id)
        
        let { body: data } = await got(`https://api.ashcon.app/mojang/v2/user/${id}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(data)

        const firstname = (data.username_history[0].username)
        const undefined = (data.uuid)
        const accage = (data.created_at)
       
        if (!regex.racism.test(firstname)) {
        if (undefined == 'f0369554-7707-486a-b230-8518f04102f7')  {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${targetUser}'s account does not exist. SSSsss`)
            } else {
                return {
                    text: `${targetUser}'s account does not exist. SSSsss`
                }
            }
        } else if (accage == null) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${targetUser}'s first Minecraft name is ${firstname} and could not fetch account age. PoroSad`)
            } else {
                return {
                    text: `${targetUser}'s first Minecraft name is ${firstname} and could not fetch account age. PoroSad`
                }
            }
        } else {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${targetUser}'s first Minecraft name is ${firstname} and created at ${accage} PunchTrees`)
            } else {
                return {
                    text: `${targetUser}'s first Minecraft name is ${firstname} and created at ${accage} PunchTrees`
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