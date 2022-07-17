const got = require("got");
const utils = require('../util/utils.js');

module.exports = {
    name: "whathappen",
    aliases: ["whathappened", "wh"],
    cooldown: 3000,
    description: "Tells you what happened on that date of history.[Usage |wh (month) (day), |whathappened (month) (day), |whathappen (month) (day) ",
    execute: async (message, args, client) => {
        const MONTH = args[0] 
        const DAY = args[1]
        if (!MONTH) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me Pls insert date, |wh (month) (date)`)
            } else {
                return {
                    text: `Pls insert date, |wh (month) (date)`
                }
            }
        }
        if (!DAY) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me Pls insert Day, |wh (month) (date)`)
            } else {
                return {
                    text: `Pls insert Day, |wh (month) (date)`
                }
            }
        }
        
        const res = await fetch(`https://byabbe.se/on-this-day/${MONTH}/${DAY}/events.json`)
        const user = await res.json();
        var random = user.events[Math.floor(Math.random()*user.events.length)];
        //console.log(random)
        if (message.senderUsername == await utils.PoroNumberOne()) {
            client.privmsg(message.channelName, `.me What happened on ${user.date} ${random.year}? ${random.description} BatChest`)
        } else {
            return {
                text: `What happened on ${user.date} ${random.year}? ${random.description} BatChest`
            }
        }

          
          
    }
};