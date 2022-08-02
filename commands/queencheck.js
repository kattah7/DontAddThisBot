const got = require('got');
const humanizeDuration = require('../humanizeDuration');
const utils = require('../util/utils.js');

module.exports = {
    name: 'queencheck',
    cooldown: 3000,
    description: 'checks if a user is a queen supporter (Pokimane)',

    execute: async (message, args, client) => {
        const USERNAME = args[0] ?? message.senderUsername;
        let data = await got(`https://api.ivr.fi/twitch/subage/${USERNAME}/pokimane`, { timeout: 10000 }).json();
        //console.log(data)

        const followAge = new Date().getTime() - Date.parse(data.followedAt);

        if (data) {
            if (data.followedAt == null) {
                if (data.cumulative.months == 0) {
                    if (message.senderUsername == (await utils.PoroNumberOne())) {
                        client.privmsg(message.channelName, `.me ${data.username} WAS NEVER SUBBED & FOLLOWING D:`);
                    } else {
                        return {
                            text: `${data.username} WAS NEVER SUBBED & FOLLOWING D:`,
                        };
                    }
                } else if (data.subscribed == true) {
                    if (message.senderUsername == (await utils.PoroNumberOne())) {
                        client.privmsg(
                            message.channelName,
                            `.me ${data.username} is subbed to pokimane for ${data.cumulative.months} months & not following. ThankEgg`
                        );
                    } else {
                        return {
                            text: `${data.username} is subbed to pokimane for ${data.cumulative.months} months & not following. ThankEgg`,
                        };
                    }
                } else if (data.cumulative.months > 0) {
                    if (message.senderUsername == (await utils.PoroNumberOne())) {
                        client.privmsg(
                            message.channelName,
                            `.me ${data.username} is previously subbed to pokimane for ${data.cumulative.months} months & not following. ThankEgg`
                        );
                    } else {
                        return {
                            text: `${data.username} is previously subbed to pokimane for ${data.cumulative.months} months & not following. ThankEgg`,
                        };
                    }
                }
            } else if (data.cumulative.months == 0) {
                if (data.cumulative.months == 0) {
                    if (message.senderUsername == (await utils.PoroNumberOne())) {
                        client.privmsg(
                            message.channelName,
                            `.me ${data.username} was never subbed to pokimane & following for ${humanizeDuration(
                                followAge
                            )} ThankEgg`
                        );
                    } else {
                        return {
                            text: `${data.username} was never subbed to pokimane & following for ${humanizeDuration(
                                followAge
                            )} ThankEgg`,
                        };
                    }
                }
            } else if (data.cumulative.months > 0) {
                if (data.subscribed == false) {
                    if (message.senderUsername == (await utils.PoroNumberOne())) {
                        client.privmsg(
                            message.channelName,
                            `.me ${data.username} was previously subbed to pokimane for ${
                                data.cumulative.months
                            } months & following for ${humanizeDuration(followAge)} ThankEgg`
                        );
                    } else {
                        return {
                            text: `${data.username} was previously subbed to pokimane for ${
                                data.cumulative.months
                            } months & following for ${humanizeDuration(followAge)} ThankEgg`,
                        };
                    }
                } else if (data.subscribed == true) {
                    if (message.senderUsername == (await utils.PoroNumberOne())) {
                        client.privmsg(
                            message.channelName,
                            `.me ${data.username} is subbed to pokimane for ${
                                data.cumulative.months
                            } months & following for ${humanizeDuration(followAge)} ThankEgg`
                        );
                    } else {
                        return {
                            text: `${data.username} is subbed to pokimane for ${
                                data.cumulative.months
                            } months & following for ${humanizeDuration(followAge)} ThankEgg`,
                        };
                    }
                }
            } else if (data.hidden == true) {
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    client.privmsg(
                        message.channelName,
                        `.me ${
                            data.username
                        }'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(
                            followAge
                        )} ThankEgg`
                    );
                } else {
                    return {
                        text: `${
                            data.username
                        }'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(
                            followAge
                        )} ThankEgg`,
                    };
                }
            }
        }
    },
};
