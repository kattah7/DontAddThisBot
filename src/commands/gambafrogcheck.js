const got = require('got');
const humanizeDuration = require('../util/humanizeDuration');
const utils = require('../util/twitch/utils.js');

module.exports = {
    tags: 'stats',
    name: 'gambafrog',
    cooldown: 3000,
    aliases: [],
    description: 'checks if a user is a gamba frog in trainwreckstv',
    canOptout: true,
    target: 'self',
    execute: async (message, args, client) => {
        const USERNAME = await utils.ParseUser(args[0] ?? message.senderUsername);
        let data = await got(`https://api.ivr.fi/twitch/subage/${USERNAME}/trainwreckstv`, { timeout: 10000 }).json();
        const followAge = new Date().getTime() - Date.parse(data.followedAt);
        if (data) {
            if (data.followedAt == null) {
                if (data.cumulative.months == 0) {
                    return {
                        text: `${data.username} WAS NEVER SUBBED & FOLLOWING EZ`,
                    };
                } else if (data.subscribed == true) {
                    return {
                        text: `${data.username} is subbed to trainwrecks for ${data.cumulative.months} months & not following. 🦍`,
                    };
                } else if (data.cumulative.months > 0) {
                    return {
                        text: `${data.username} is previously subbed to trainwrecks for ${data.cumulative.months} months & not following. 🦍`,
                    };
                }
            } else if (data.cumulative.months == 0) {
                if (data.cumulative.months == 0) {
                    var date1 = new Date();
                    const date2 = new Date(data.followedAt); // 2022/1/19
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log(diffDays);
                    if (diffDays < 365) {
                        return {
                            text: `${data.username} was never subbed to trainwrecks & following for ${humanizeDuration(
                                followAge
                            )} WutFace`,
                        };
                    } else {
                        return {
                            text: `${data.username} was never subbed to trainwrecks & following for ${humanizeDuration(
                                followAge
                            )} 🦍`,
                        };
                    }
                }
            } else if (data.cumulative.months > 0) {
                const date1 = new Date();
                const date2 = new Date(data.followedAt); // 2022/1/19
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                console.log(diffDays);
                if (data.subscribed == false) {
                    if (diffDays < 365) {
                        return {
                            text: `${data.username} was previously subbed to trainwrecks for ${
                                data.cumulative.months
                            } months & following for ${humanizeDuration(followAge)} WutFace`,
                        };
                    } else {
                        return {
                            text: `${data.username} was previously subbed to trainwrecks for ${
                                data.cumulative.months
                            } months & following for ${humanizeDuration(followAge)} 🦍`,
                        };
                    }
                } else if (data.subscribed == true) {
                    const date1 = new Date();
                    const date2 = new Date(data.followedAt); // 2022/1/19
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log(diffDays);
                    if (diffDays < 365) {
                        return {
                            text: `${data.username} is subbed to trainwrecks for ${
                                data.cumulative.months
                            } months & following for ${humanizeDuration(followAge)} WutFace`,
                        };
                    } else {
                        return {
                            text: `${data.username} is subbed to trainwrecks for ${
                                data.cumulative.months
                            } months & following for ${humanizeDuration(followAge)} 🦍`,
                        };
                    }
                }
            } else if (data.hidden == true) {
                const date1 = new Date();
                const date2 = new Date(data.followedAt); // 2022/1/19
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                console.log(diffDays);
                if (diffDays < 365) {
                    return {
                        text: `${
                            data.username
                        }'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(
                            followAge
                        )} WutFace`,
                    };
                } else {
                    return {
                        text: `${
                            data.username
                        }'s subscription is hidden, Try hovering over their sub badge. Following for ${humanizeDuration(
                            followAge
                        )} 🦍`,
                    };
                }
            }
        }
    },
};
