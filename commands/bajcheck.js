const got = require('got');
const humanizeDuration = require('../humanizeDuration');
const utils = require('../util/utils.js');

module.exports = {
    name: 'bajcheck',
    cooldown: 10000,
    description: 'checks if a user is a baj',
    poro: true,

    execute: async (message, args, client) => {
        const USERNAME = args[0] ?? message.senderUsername;
        let data = await got(`https://api.ivr.fi/twitch/subage/${USERNAME}/forsen`, { timeout: 10000 }).json();

        const followAge = new Date().getTime() - Date.parse(data.followedAt);
                if (data) {
                    if (data.followedAt == null) {
                        if (data.cumulative.months == 0) {
                            return {
                                text: `${USERNAME} WAS NEVER SUBBED & FOLLOWING forsenBased`,
                            };
                        } else if (data.subscribed == true) {
                            return {
                                text: `${USERNAME} is subbed to forsen for ${data.cumulative.months} months & not following. forsenE`,
                            };
                        } else if (data.cumulative.months > 0) {
                            return {
                                text: `${USERNAME} is previously subbed to forsen for ${data.cumulative.months} months & not following. forsenWhat`,
                            };
                        }
                    } else if (data.cumulative.months == 0) {
                        if (data.cumulative.months == 0) {
                            return {
                                text: `${USERNAME} was never subbed to forsen & following for ${humanizeDuration(
                                    followAge
                                )} forsenWhat`,
                            };
                        }
                    } else if (data.cumulative.months > 0) {
                        if (data.subscribed == false) {
                            return {
                                text: `${USERNAME} was previously subbed to forsen for ${
                                    data.cumulative.months
                                } months & following for ${humanizeDuration(followAge)} forsenWhat`,
                            };
                        } else if (data.subscribed == true) {
                            return {
                                text: `${USERNAME} is subbed to forsen for ${
                                    data.cumulative.months
                                } months & following for ${humanizeDuration(followAge)} forsenE`,
                            };
                        }
                    } else if (data.hidden == true) {
                        return {
                            text: `${USERNAME}'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(
                                followAge
                            )} forsenE`,
                        };
                    }
                }
    },
};
