const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "juicercheck",
    cooldown: 3000,
    description: "checks if a user is a juicer",
    poro: true,

    execute: async(message, args, client) => {
        const USERNAME = args[0] ?? message.senderUsername
        const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': USERNAME}}).json();
        console.log(banned, banphrase_data)
        let data = await got(`https://api.ivr.fi/twitch/subage/${USERNAME}/xqc`, { timeout: 10000}).json();
        console.log(data)

        const followAge = new Date().getTime() - Date.parse(data.followedAt);
        if (banned == false) {
            if (data) {
                if (data.followedAt == null) {
                    if (data.cumulative.months == 0) {
                        if (message.senderUsername == process.env.NUMBER_ONE) {
                            client.privmsg(message.channelName, `.me ${USERNAME} WAS NEVER SUBBED & FOLLOWING EZ`)
                        } else {
                            return {
                                text: `${USERNAME} WAS NEVER SUBBED & FOLLOWING EZ`
                            }
                        }
                    } else if (data.subscribed == true) {
                        if (message.senderUsername == process.env.NUMBER_ONE) {
                            client.privmsg(message.channelName, `.me ${USERNAME} is subbed to xQc for ${data.cumulative.months} months & not following. xqcL`)
                        } else {
                            return {
                                text: `${USERNAME} is subbed to xQc for ${data.cumulative.months} months & not following. xqcL`
                            }
                        }
                    } else if (data.cumulative.months > 0) {
                        if (message.senderUsername == process.env.NUMBER_ONE) {
                            client.privmsg(message.channelName, `.me ${USERNAME} is previously subbed to xQc for ${data.cumulative.months} months & not following. xqcL`)
                        } else {
                            return {
                                text: `${USERNAME} is previously subbed to xQc for ${data.cumulative.months} months & not following. xqcL`
                            }
                        }
                    }
                } else if (data.cumulative.months == 0) {
                    if (data.cumulative.months == 0) {
                        if (message.senderUsername == process.env.NUMBER_ONE) {
                            client.privmsg(message.channelName, `.me ${USERNAME} was never subbed to xQc & following for ${humanizeDuration(followAge)} xqcL`)
                        } else {
                            return {
                                text: `${USERNAME} was never subbed to xQc & following for ${humanizeDuration(followAge)} xqcL`
                            }
                        } 
                    }
                } else if (data.cumulative.months > 0) {
                    if (data.subscribed == false) {
                        if (message.senderUsername == process.env.NUMBER_ONE) {
                            client.privmsg(message.channelName, `.me ${USERNAME} was previously subbed to xQc for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} xqcL`)
                        } else {
                            return {
                                text: `${USERNAME} was previously subbed to xQc for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} xqcL`
                            }
                        }
                    } else if (data.subscribed == true) {
                        if (message.senderUsername == process.env.NUMBER_ONE) {
                            client.privmsg(message.channelName, `.me ${USERNAME} is subbed to xQc for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} xqcL`)
                        } else {
                            return {
                                text: `${USERNAME} is subbed to xQc for ${data.cumulative.months} months & following for ${humanizeDuration(followAge)} xqcL`
                            }
                        }
                    } 
                } else if (data.hidden == true) {
                    if (message.senderUsername == process.env.NUMBER_ONE) {
                        client.privmsg(message.channelName, `.me ${USERNAME}'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(followAge)} xqcL`)
                    } else {
                        return {
                            text: `${USERNAME}'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(followAge)} xqcL`
                        }
                    }
                
                }
            } 
        } else if (banned == true) {
            return {
                text: `banned msg lol`
            }
        }
        
    }

}
