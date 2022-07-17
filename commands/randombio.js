const got = require("got")
const regex = require('../util/regex.js');
const utils = require("../util/utils.js");

module.exports = {
    name: "randombio",
    description: "gets random bio in the channel",
    cooldown: 3000,
    aliases: ['rb'],
   execute: async(message, args, client) => {
       const { chatters } = await got(`http://tmi.twitch.tv/group/user/${message.channelName}/chatters`).json();
       var allChatters = [...chatters.broadcaster, ...chatters.moderators, ...chatters.vips, ...chatters.viewers];
       var randomChatters = allChatters[Math.floor(Math.random()* allChatters.length)]
       //console.log(randomChatters)
       const bio  = await got(`https://api.twitch.tv/helix/users?login=${randomChatters}`, {
           headers: {
               Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
               "Client-ID": process.env.CLIENT_ID,
           }
       }).json();
       
       if (!regex.racism.test(bio.data[0].description)) {
       if (bio.data[0].description == '') {
        if (message.senderUsername == await utils.PoroNumberOne()) {
            client.privmsg(message.channelName, `.me Unlucky! user doesn't have a bio FeelsDankMan`)
        } else {
            return {
                text: `Unlucky! user doesn't have a bio FeelsDankMan`
            } 
        }
    } else {
        if (message.senderUsername == await utils.PoroNumberOne()) {
            client.privmsg(message.channelName, `.me ${bio.data[0].description}`)
        } else {
            return {
                text: `${bio.data[0].description}`
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
}