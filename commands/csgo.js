const util = require("util");
const regex = require('../util/regex.js');

module.exports = {
    name: "csgo",
    aliases: [],
    cooldown: 1000,
    description: "check your csgo stats Pepege forsenPls",
    execute: async (message, args, client) => {
        var myHeaders = new Headers();
        myHeaders.append("TRN-Api-Key", `${process.env.TRN_Api_Key}`);

        var requestOptions = {
            method: "GET",
            redirect: "follow",
            headers: myHeaders,
        };

        const res = await fetch(`https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${args.join(" ")}`, requestOptions);
        const user = await res.json();

        console.log(util.inspect(user, { showHidden: false, depth: null, colors: true }));
        if (!regex.racism.test(args.join(" "))) {
        if (user.errors) {
            if (user.errors[0].code == "CollectorResultStatus::NotFound") {
                return {
                    text: `${args.join(" ")} Not found :( , Please use Steam ID, Steam Community URL, Steam Vanity Username, etc.`,
                };  
            } else if (user.errors[0].code == "CollectorResultStatus::Private") {
                return {
                    text: `${args.join(" ")} Profile is private :p , Please enable game settings under privacy settings`,
                };
            }
        } else {
            const playtime = user.data.segments[0].stats.timePlayed.displayValue;
            const matches = user.data.segments[0].stats.matchesPlayed.displayValue;
            const wins = user.data.segments[0].stats.losses.displayValue;
            const losses = user.data.segments[0].stats.wins.displayValue;
            const kills = user.data.segments[0].stats.kills.displayValue;
            const deaths = user.data.segments[0].stats.deaths.displayValue;
            const kd = user.data.segments[0].stats.kd.displayValue;

            
            return {
                text: `${args.join(" ")} has ${playtime} in CSGO LuL ${matches} Rounds [W:${losses} L:${wins}] LuL ${kd} K/D [K:${kills} D:${deaths}]`,
            };
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