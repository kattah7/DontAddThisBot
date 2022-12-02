const humanizeDuration = require('../util/humanizeDuration');
const utils = require('../util/twitch/utils.js');
const fetch = require('node-fetch');

module.exports = {
    tags: 'stats',
    name: 'juicercheck',
    cooldown: 5000,
    description: 'checks if a user is a juicer',
    poro: true,
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0] ?? message.senderUsername);
        const data = await fetch(`https://api.ivr.fi/v2/twitch/subage/${targetUser}/xqc`, {
            method: 'GET',
            headers: {
                'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
            },
        }).then((res) => res.json());
        const { statusHidden, followedAt, cumulative, meta, error } = data;
        if (error) {
            return {
                text: `⁉ ${error?.message}` ?? 'Something went wrong',
            };
        }

        const followAge = humanizeDuration(new Date().getTime() - Date.parse(followedAt));
        if (statusHidden) {
            const isFollowing = followedAt ? `(Followed ${followAge})` : '';
            return {
                text: `${targetUser}'s subage is hidden pepeLaugh TeaTime ${isFollowing}`,
            };
        }

        if (cumulative === null) {
            const isFollowing = followedAt ? `(Followed ${followAge}) xqcL` : '';
            return {
                text: `${targetUser} is not subbed to xQc EZ ${isFollowing}`,
            };
        } else if (cumulative?.months) {
            const isFollowing = followedAt ? `(Followed ${followAge}) xqcL` : '';
            const isSubbed = meta === null ? 'was previously' : 'is currently';
            return {
                text: `${targetUser} ${isSubbed} subbed to xQc for ${cumulative.months} months WutFace ${isFollowing}`,
            };
        }
    },
};
