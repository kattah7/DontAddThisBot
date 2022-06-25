const regex = require('../util/regex.js');

module.exports = {
    name: "spam",
    aliases: [],
    cooldown: 5000,
    permission: 1, //1 = mod, 2 = broadcaster
    description:"Spams message in chat",
    execute: async (message, args, client) => {
    if (!regex.racism.test(args.join(" "))) {
        if (args.length < 2) return { text: "Usage: |spam 3 xd" };

        const count = args[0];
        const phrase = args.slice(1).join(" ").replace("!", "ǃ").replace("=", "꓿").replace("$", "💲");
        if (isNaN(count)) return { text: `the spam count should be a number` };
        if (count > 1000) return { text: `the maximum spam count is 50` };
        if (count < 2) return { text: `the minimum spam count is 2` };

        for (let xd = 0; xd < count; xd++) {
            client.privmsg(message.channelName, phrase);
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
        return { text: `That message violates the terms of service.` }
    }
    },
};
