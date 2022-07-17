const got = require("got");
const humanizeDuration = require("../humanizeDuration");
const utils = require("../util/utils.js");

module.exports = {
    name: "gambafrog",
    cooldown: 3000,
    description: "checks if a user is a gamba frog in trainwreckstv",

    execute: async(message, args, client) => {
        const USERNAME = args[0] ?? message.senderUsername
        let data = await got(`https://api.ivr.fi/twitch/subage/${USERNAME}/trainwreckstv`, { timeout: 10000}).json();
        console.log(data)

        const followAge = new Date().getTime() - Date.parse(data.followedAt);
        
        if (data) {
            if (data.followedAt == null) {
                if (data.cumulative.months == 0) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me ${data.username} WAS NEVER SUBBED & FOLLOWING EZ`)
                    } else {
                        return {
                            text: `${data.username} WAS NEVER SUBBED & FOLLOWING EZ`
                        }
                    }
                } else if (data.subscribed == true) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me ${data.username} is subbed to trainwrecks for ${data.cumulative.months} months & not following. 🦍`)
                    } else {
                        return {
                            text: `${data.username} is subbed to trainwrecks for ${data.cumulative.months} months & not following. 🦍`
                        }
                    }
                } else if (data.cumulative.months > 0) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me ${data.username} is previously subbed to trainwrecks for ${data.cumulative.months} months & not following. 🦍`)
                    } else {
                        return {
                            text: `${data.username} is previously subbed to trainwrecks for ${data.cumulative.months} months & not following. 🦍`
                        }
                    }
                }
            } else if (data.cumulative.months == 0) {
                if (data.cumulative.months == 0) {
                    var date1 = new Date()
                    const date2 = new Date(data.followedAt); // 2022/1/19
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log(diffDays)
                    if (diffDays < 365) {
                        if (message.senderUsername == await utils.PoroNumberOne()) {
                            client.privmsg(message.channelName, `.me ${data.username} was never subbed to trainwrecks & following for ${humanizeDuration(followAge)} WutFace`)
                        } else {
                            return {
                                text: `${data.username} was never subbed to trainwrecks & following for ${humanizeDuration(followAge)} WutFace`
                            }
                        }
                    } else {
                        if (message.senderUsername == await utils.PoroNumberOne()) {
                            client.privmsg(message.channelName, `.me ${data.username} was never subbed to trainwrecks & following for ${humanizeDuration(followAge)} 🦍`)
                        } else {
                            return {
                                text: `${data.username} was never subbed to trainwrecks & following for ${humanizeDuration(followAge)} 🦍`
                            }
                        } 
                    }
                }
            } else if (data.cumulative.months > 0) {
                var date1 = new Date()
                    const date2 = new Date(data.followedAt); // 2022/1/19
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log(diffDays)
                if (data.subscribed == false) {
                    if (diffDays < 365) {
                        if (message.senderUsername == await utils.PoroNumberOne()) {
                            client.privmsg(message.channelName, `.me ${data.username} was previously subbed to trainwrecks for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} WutFace`)
                        } else {
                            return {
                                text: `${data.username} was previously subbed to trainwrecks for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} WutFace`
                            } 
                        }
                    } else {
                        if (message.senderUsername == await utils.PoroNumberOne()) {
                            client.privmsg(message.channelName, `.me ${data.username} was previously subbed to trainwrecks for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} 🦍`)
                        } else {
                            return {
                                text: `${data.username} was previously subbed to trainwrecks for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} 🦍`
                            }
                        } 
                    }
                } else if (data.subscribed == true) {
                    var date1 = new Date()
                    const date2 = new Date(data.followedAt); // 2022/1/19
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log(diffDays)
                    if (diffDays < 365) {
                        if (message.senderUsername == await utils.PoroNumberOne()) {
                            client.privmsg(message.channelName, `.me ${data.username} is subbed to trainwrecks for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} WutFace`)
                        } else {
                            return {
                                text: `${data.username} is subbed to trainwrecks for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} WutFace`
                            } 
                        } 
                    } else {
                        if (message.senderUsername == await utils.PoroNumberOne()) {
                            client.privmsg(message.channelName, `.me ${data.username} is subbed to trainwrecks for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} 🦍`)
                        } else {
                            return {
                                text: `${data.username} is subbed to trainwrecks for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} 🦍`
                            }
                        }
                    }
                } 
            } else if (data.hidden == true) {
                var date1 = new Date()
                    const date2 = new Date(data.followedAt); // 2022/1/19
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log(diffDays)
                if (diffDays < 365) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me ${data.username}'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(followAge)} WutFace`)
                    } else {
                        return {
                            text: `${data.username}'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(followAge)} WutFace`
                        } 
                    }
                } else {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me ${data.username}'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(followAge)} 🦍`)
                    } else {
                        return {
                            text: `${data.username}'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(followAge)} 🦍`
                        }
                    } 
                }
            
            }
        } 
    }

}