const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "suggest",
    aliases: ["suggestion"],
    cooldown: 5000,
    description: "Suggestion to the bot",
    execute: async (message, args, client) => {
        if (args.length < 1) return { text: "Usage: |suggest <suggestion>" };
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth()+1;
        var day = today.getDate();
        var currentdate = year+"-"+month+"-"+day
        const whurl2 = 'https://discord.com/api/webhooks/987635741523869757/MyyRLZ6MV-GSLjuzHEU2JJ5fyWcimcFiT_NGiLRfp-ibv5KpUF2kzHH-kNDgfHfU1leY'
        const msg2 = {
            "embeds": [{
                "title": `Suggestion by ${message.senderUsername} in ${message.channelName}`,
                "description": `${args.join(" ")} ${currentdate}`,
                "color": 1127128,
        
            }]
        }
        fetch(whurl2 + "?wait=true", 
        {"method":"POST", 
        "headers": {"content-type": "application/json"},
        "body": JSON.stringify(msg2)})
        .then(a=>a.json()).then(console.log)
        return {
            text: `Suggestion sent! :)`
        }
    }
}