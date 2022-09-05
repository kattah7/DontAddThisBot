const got = require('got');
const humanizeDuration = require('../humanizeDuration');

module.exports = {
    name: 'juicercheck',
    cooldown: 10000,
    description: 'checks if a user is a juicer',
    poro: true,

    execute: async (message, args, client) => {
        const USERNAME = args[0] ?? message.senderUsername;
        let data = await got(`https://api.ivr.fi/twitch/subage/${USERNAME}/xqc`, { timeout: 10000 }).json();
        const followAge = new Date().getTime() - Date.parse(data.followedAt);
                if (data) {
                    if (data.followedAt == null) {
                        if (data.cumulative.months == 0) {
                            return {
                                text: `${USERNAME} WAS NEVER SUBBED & FOLLOWING EZ`,
                            };
                        } else if (data.subscribed == true) {
                            return {
                                text: `${USERNAME} is subbed to xQc for ${data.cumulative.months} months & not following. xqcL`,
                            };
                        } else if (data.cumulative.months > 0) {
                            return {
                                text: `${USERNAME} is previously subbed to xQc for ${data.cumulative.months} months & not following. xqcL`,
                            };
                        }
                    } else if (data.cumulative.months == 0) {
                        if (data.cumulative.months == 0) {
                            return {
                                text: `${USERNAME} was never subbed to xQc & following for ${humanizeDuration(
                                        followAge
                                    )} xqcL`,
                            };
                        }
                    } else if (data.cumulative.months > 0) {
                        if (data.subscribed == false) {
                            return {
                                text: `${USERNAME} was previously subbed to xQc for ${
                                        data.cumulative.months
                                    } months & following for ${humanizeDuration(followAge)} xqcL`,
                            };
                        } else if (data.subscribed == true) {
                            return {
                                text: `${USERNAME} is subbed to xQc for ${
                                        data.cumulative.months
                                    } months & following for ${humanizeDuration(followAge)} xqcL`,
                            };
                        }
                    } else if (data.hidden == true) {
                        return {
                            text: `${USERNAME}'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(
                                    followAge
                                )} xqcL`,
                        };
                    }
                }
    },
};
