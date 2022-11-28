const fetch = require('node-fetch');
const humanizeDuration = require('../util/humanizeDuration');
const utils = require('../util/twitch/utils.js');

module.exports = {
    tags: 'stats',
    name: 'bajcheck',
    cooldown: 5000,
    description: 'checks if a user is a baj',
    poro: true,
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0] ?? message.senderUsername);
        const data = await fetch(`https://api.ivr.fi/v2/twitch/subage/${targetUser}/forsen`, {
            method: 'GET',
        }).then((res) => res.json());
        const { statusHidden, followedAt, streak, cumulative, meta, error } = data;
        if (error) {
            return {
                text: `⁉ ${error?.message}` ?? 'Something went wrong eShrug',
            };
        }

        const followAge = humanizeDuration(new Date().getTime() - Date.parse(followedAt));
        if (statusHidden) {
            const isFollowing = followedAt ? `(Followed ${followAge})` : '';
            return {
                text: `${targetUser}'s subage is hidden eShrug ${isFollowing}`,
            };
        }

        if (cumulative === null) {
            const isFollowing = followedAt ? `(Followed ${followAge}) forsenE` : '';
            return {
                text: `${targetUser} is not subbed to Forsen EZ ${isFollowing}`,
            };
        } else if (cumulative?.months) {
            const isFollowing = followedAt ? `(Followed ${followAge}) forsenScoots` : '';
            const isSubbed = meta === null ? 'was previously' : 'is currently';
            return {
                text: `${targetUser} ${isSubbed} subbed to Forsen for ${cumulative.months} months PagChomp ${isFollowing}`,
            };
        }
    },
};
