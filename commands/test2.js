const got = require("got");

module.exports = {
    name: "whathappen",
    aliases: ["whathappened", "wh"],
    cooldown: 3000,
    description: "test command",
    execute: async (message, args) => {
        const MONTH = args[0] ?? message.senderUsername;
        const DAY = args[1] ?? message.senderUsername;
        
        const res = await fetch(`https://byabbe.se/on-this-day/${MONTH}/${DAY}/events.json`)
        const user = await res.json();
        console.log(user)

        const random = Math.floor(Math.random() * 40) + 10;
        return {
            text: `What happened on ${user.date} ${user.events[random].year}? ${user.events[random].description} OMGScoots`
        }

          
          
    }
};