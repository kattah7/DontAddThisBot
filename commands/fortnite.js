const got = require("got");
const utils = require("../util/utils.js");
const regex = require('../util/regex.js');

module.exports = {
    name: "fortnite",
    aliases: ["fn"],
    cooldown: 1000,
    description:"check your fortnite stats zzoomerPls",
    execute: async (message, args, client) => {
        var myHeaders = new Headers();
        myHeaders.append("TRN-Api-Key", `${process.env.TRN_Api_Key}`);

        var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
        };

        
       const res = await fetch(`https://api.fortnitetracker.com/v1/profile/all/${args.join(" ")}`, requestOptions)
       const user = await res.json();
       console.log(user)

       
       const ERROR = user.error
        if (!regex.racism.test(args.join(" "))) {
      if (ERROR == 'Player Not Found') {
        if (message.senderUsername == await utils.PoroNumberOne()) {
          return client.privmsg(message.channelName, `.me ${args.join(" ")} Not Found monkaS`)
      }
        return {
            text: `${args.join(" ")} Not Found monkaS`
        }
      } else if (ERROR == 'Profile is private. Make it public please.  Check your fortnite settings.') {
        if (message.senderUsername == await utils.PoroNumberOne()) {
          return client.privmsg(message.channelName, `.me ${args.join(" ")}'s profile is private DansGame`)
      }
        return {
            text: `${args.join(" ")}'s profile is private DansGame`
        }
      } else if (user.code == '3') {
        return {
          text: `${user.error}`
        }
      } else {
        const matchesPlayed = user.lifeTimeStats[7].value;
        const totalWins = user.lifeTimeStats[8].value;
        const totalKills = user.lifeTimeStats[10].value;
        const totalKD = user.lifeTimeStats[11].value;
        const winRate = user.lifeTimeStats[9].value;

        if (message.senderUsername == await utils.PoroNumberOne()) {
          return client.privmsg(message.channelName, `.me ${args.join(" ")}'s All time Fortnite matches played ${matchesPlayed}, WINS: ${totalWins} with ${winRate} win rate, KILLS: ${totalKills} with ${totalKD} K/D PogBones`)
      } else {
        return {
          text: `${args.join(" ")}'s All time Fortnite matches played ${matchesPlayed}, WINS: ${totalWins} with ${winRate} win rate, KILLS: ${totalKills} with ${totalKD} K/D PogBones`
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