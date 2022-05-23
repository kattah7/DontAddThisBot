const got = require("got");
const { CursoredV1Paginator } = require("twitter-api-v2/dist/paginators/paginator.v1");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "gambafrog",
    cooldown: 3000,
    description: "checks if a user is a gambafrog in trainwreckstv",

    execute: async(message, args) => {
        const USERNAME = args[0] ?? message.senderUsername
        let data = await got(`https://api.ivr.fi/twitch/subage/${USERNAME}/trainwreckstv`, { timeout: 10000}).json();
        console.log(data)

        const followAge = new Date().getTime() - Date.parse(data.followedAt);
        
        if (data) {
            if (data.followedAt == null) {
                if (data.streak.months == 0) {
                    return {
                        text: `${data.username} WAS NEVER SUBBED & FOLLOWING 🦍`
                    }
                } else if (data.subscribed == true) {
                    return {
                        text: `${data.username} is subbed to trainwreckstv for ${data.cumulative.months} months & not following 🦍`
                    }
                } else if (data.cumulative.months > 0) {
                    return {
                        text: `${data.username} is previously subbed to trainwreckstv for ${data.cumulative.months} months & not following. 🦍`
                    }
                }
            } else if (data.cumulative.months == 0) {
                var date1 = new Date()
                    const date2 = new Date(data.followedAt); // 2022/1/19
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log(diffDays)
                if (data.cumulative.months == 0) {
                    if (diffDays < 365) {
                        return {
                            text: `${data.username} was never subbed to trainwreckstv & following for ${humanizeDuration(followAge)} WutFace gamba frog` 
                        }
                } return {
                    text: `${data.username} was never subbed to trainwreckstv & following for ${humanizeDuration(followAge)} 🦍`
                } 
            } else if (data.cumulative.months > 0) {
                if (data.subscribed == false) {
                    var date1 = new Date()
                    const date2 = new Date(data.followedAt); // 2022/1/19
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log(diffDays)
                    if (diffDays < 365) {
                        return {
                            text: `${data.username} was previously subbed to trainwreckstv for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} WutFace GAMBA FROG`
                        }
                    } else if (diffDays > 365) {
                        return {
                            text: `${data.username} was previously subbed to trainwreckstv for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} 🦍`
                        }
                    }
                } else if (data.subscribed == true) {
                    var date1 = new Date()
                    const date2 = new Date(data.followedAt); // 2022/1/19
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log(diffDays)
                   
                    if (diffDays < 365) {
                        if (data.cumulative.months <= 5) {
                            return {
                                text: `${data.username} IS A ${data.cumulative.months} MONTH SUB FOLLOWING ${humanizeDuration(followAge)} AGO, GAMBA FROG WutFace `
                            }
                        } else if (data.cumulative.months > 5) {
                            return {
                                text: `${data.username} is subbed to trainwreckstv for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} 🦍`
                            } 
                        }
                    } else {
                        return {
                            text: `${data.username} is subbed to trainwreckstv for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} 🦍`
                        }
                    }
                }   
                
                } else if (data.hidden == true) {
                
                    return {
                        text: `${data.username}'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(followAge)} 🦍`
                    }
            } 
        } 
    } 
}
}