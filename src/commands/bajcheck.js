const fetch = require('node-fetch');
const humanizeDuration = require('../misc/humanizeDuration');
const utils = require('../util/twitch/utils.js');

module.exports = {
	tags: 'stats',
	name: 'bajcheck',
	cooldown: 5000,
	aliases: [],
	description: 'checks if a user is a baj',
	canOptout: true,
	target: 'self',
	execute: async (client, msg) => {
		const targetUser = utils.ParseUser(msg.args[0] ?? msg.user.login);
		const data = await fetch(`https://api.ivr.fi/v2/twitch/subage/${targetUser}/forsen`, {
			method: 'GET',
			headers: {
				'User-Agent':
					'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
			},
		}).then((res) => res.json());

		const { statusHidden, followedAt, streak, cumulative, meta, error } = data;
		if (error) {
			return {
				text: `⁉ ${error?.message}` ?? 'Something went wrong eShrug',
				reply: false,
			};
		}

		const followAge = humanizeDuration(new Date().getTime() - Date.parse(followedAt));
		if (statusHidden) {
			const isFollowing = followedAt ? `(Followed ${followAge})` : '';
			return {
				text: `${targetUser}'s subage is hidden eShrug ${isFollowing}`,
				reply: true,
			};
		}

		if (cumulative === null) {
			const isFollowing = followedAt ? `(Followed ${followAge}) forsenE` : '';
			return {
				text: `${targetUser} is not subbed to Forsen EZ ${isFollowing}`,
				reply: true,
			};
		} else if (cumulative?.months) {
			const isFollowing = followedAt ? `(Followed ${followAge}) forsenScoots` : '';
			const isSubbed = meta === null ? 'was previously' : 'is currently';
			return {
				text: `${targetUser} ${isSubbed} subbed to Forsen for ${cumulative.months} months PagChomp ${isFollowing}`,
				reply: true,
			};
		}
	},
};
