const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "bajcheck",
    cooldown: 3000,
    description: "checks if a user is a baj",

    execute: async(message, args) => {
        const USERNAME = args[0] ?? message.senderUsername
        let data = await got(`https://api.ivr.fi/twitch/subage/${USERNAME}/forsen`, { timeout: 10000}).json();
        console.log(data)

        const followAge = new Date().getTime() - Date.parse(data.followedAt);
        
        if (data) {
            if (data.followedAt == null) {
                if (data.cumulative.months == 0) {
                    return {
                        text: `${data.username} WAS NEVER SUBBED & FOLLOWING forsenBased`
                    }
                } else if (data.subscribed == true) {
                    return {
                        text: `${data.username} is subbed to forsen for ${data.cumulative.months} months & not following. forsenE`
                    }
                } else if (data.cumulative.months > 0) {
                    return {
                        text: `${data.username} is previously subbed to forsen for ${data.cumulative.months} months & not following. forsenWhat`
                    }
                }
            } else if (data.cumulative.months == 0) {
                if (data.cumulative.months == 0) {
                    return {
                        text: `${data.username} was never subbed to forsen & following for ${humanizeDuration(followAge)} forsenWhat`
                    } 
                }
            } else if (data.cumulative.months > 0) {
                if (data.subscribed == false) {
                    return {
                        text: `${data.username} was previously subbed to forsen for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} forsenWhat`
                    }
                } else if (data.subscribed == true) {
                    return {
                        text: `${data.username} is subbed to forsen for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} forsenE`
                    }
                } 
            }
        }
    }

}