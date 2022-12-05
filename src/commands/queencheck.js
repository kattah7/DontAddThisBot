const fetch = require('node-fetch');
const humanizeDuration = require('../util/humanizeDuration');
const { ParseUser } = require('../util/twitch/utils.js');

module.exports = {
    tags: 'stats',
    name: 'queencheck',
    aliases: [],
    cooldown: 3000,
    description: 'checks if a user is a queen supporter (Pokimane)',
    canOptout: true,
    target: 'self',
    execute: async (message, args, client) => {
        const targetUser = await ParseUser(args[0] ?? message.senderUsername);
        const data = await fetch(`https://api.ivr.fi/v2/twitch/subage/${targetUser}/pokimane`, {
            method: 'GET',
            headers: {
                'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
            },
        }).then((res) => res.json());
        const { statusHidden, followedAt, streak, cumulative, meta, error } = data;
        if (error) {
            return {
                text: `⁉ ${error?.message}` ?? 'Something went wrong',
            };
        }

        const followAge = humanizeDuration(new Date().getTime() - Date.parse(followedAt), { largest: 2 });
        if (statusHidden) {
            const isFollowing = followedAt ? `(Followed ${followAge})` : '';
            return {
                text: `${targetUser}'s subage is hidden Stare ${isFollowing}`,
            };
        }

        if (cumulative === null) {
            const isFollowing = followedAt ? `(Followed ${followAge}) pokiW` : '';
            return {
                text: `${targetUser} is not subbed to pokimane D: ${isFollowing}`,
            };
        } else if (cumulative?.months) {
            const isFollowing = followedAt ? `(Followed ${followAge}) Stare` : '';
            const isSubbed = meta === null ? 'was previously' : 'is currently';
            return {
                text: `${targetUser} ${isSubbed} subbed to pokimane for ${cumulative.months} months PagChomp ${isFollowing}`,
            };
        }
    },
};
