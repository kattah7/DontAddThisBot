const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "juicercheck",
    cooldown: 3000,
    description: "checks if a user is a juicer",

    execute: async(message, args) => {
        const USERNAME = args[0] ?? message.senderUsername
        let data = await got(`https://api.ivr.fi/twitch/subage/${USERNAME}/xqc`, { timeout: 10000}).json();
        console.log(data)

        const followAge = new Date().getTime() - Date.parse(data.followedAt);
        
        if (data) {
            if (data.followedAt == null) {
                if (data.streak.months == 0) {
                    return {
                        text: `${data.username} WAS NEVER SUBBED & FOLLOWING EZ`
                    }
                } else  {
                    return {
                        text: `${data.username} is subbed to xQc for ${data.cumulative.months} months & not following. xqcL`
                    }
                }
            } else if (data.cumulative.months == 0) {
                if (data.cumulative.months == 0) {
                    return {
                        text: `${data.username} was never subbed to xQc & following for ${humanizeDuration(followAge)} xqcL`
                    } 
                }
            } else if (data.cumulative.months > 0) {
                if (data.subscribed == false) {
                    return {
                        text: `${data.username} was previously subbed to xQc for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} xqcL`
                    }
                } else if (data.subscribed == true) {
                    return {
                        text: `${data.username} is subbed to xQc for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} xqcL`
                    }
                }
            }
        }
    }

}