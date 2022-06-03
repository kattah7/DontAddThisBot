const got = require("got");
const util = require('util')

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

       
       const ERROR = user.error

      if (ERROR == 'Player Not Found') {
        if (message.senderUsername == process.env.NUMBER_ONE) {
          return client.privmsg(message.channelName, `.me ${args.join(" ")} Not Found monkaS`)
      }
        return {
            text: `${args.join(" ")} Not Found monkaS`
        }
      } else if (ERROR == 'Profile is private. Make it public please.  Check your fortnite settings.') {
        if (message.senderUsername == process.env.NUMBER_ONE) {
          return client.privmsg(message.channelName, `.me ${args.join(" ")}'s profile is private DansGame`)
      }
        return {
            text: `${args.join(" ")}'s profile is private DansGame`
        }
      } else {
        const matchesPlayed = user.lifeTimeStats[7].value;
        const totalWins = user.lifeTimeStats[8].value;
        const totalKills = user.lifeTimeStats[10].value;
        const totalKD = user.lifeTimeStats[11].value;
        const winRate = user.lifeTimeStats[9].value;

        if (message.senderUsername == process.env.NUMBER_ONE) {
          return client.privmsg(message.channelName, `.me ${args.join(" ")}'s All time Fortnite matches played ${matchesPlayed}, WINS: ${totalWins} with ${winRate} win rate, KILLS: ${totalKills} with ${totalKD} K/D PogBones`)
      } else {
        return {
          text: `${args.join(" ")}'s All time Fortnite matches played ${matchesPlayed}, WINS: ${totalWins} with ${winRate} win rate, KILLS: ${totalKills} with ${totalKD} K/D PogBones`
      }
      }
      }
    }
};