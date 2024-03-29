const humanizeDuration = require('../misc/humanizeDuration');
const { ParseUser } = require('../util/twitch/utils.js');
const fetch = require('node-fetch');

module.exports = {
	tags: 'stats',
	name: 'juicercheck',
	cooldown: 5000,
	aliases: [],
	description: 'checks if a user is a juicer',
	canOptout: true,
	target: 'self',
	execute: async (client, msg) => {
		const targetUser = ParseUser(msg.args[0] ?? msg.user.login);
		const data = await fetch(`https://api.ivr.fi/v2/twitch/subage/${targetUser}/xqc`, {
			method: 'GET',
			headers: {
				'User-Agent':
					'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
			},
		}).then((res) => res.json());

		const { statusHidden, followedAt, cumulative, meta, error } = data;
		if (error) {
			return {
				text: `⁉ ${error?.message}` ?? 'Something went wrong',
				reply: false,
			};
		}

		const followAge = humanizeDuration(new Date().getTime() - Date.parse(followedAt));
		if (statusHidden) {
			const isFollowing = followedAt ? `(Followed ${followAge})` : '';
			return {
				text: `${targetUser}'s subage is hidden pepeLaugh TeaTime ${isFollowing}`,
				reply: false,
			};
		}

		if (cumulative === null) {
			const isFollowing = followedAt ? `(Followed ${followAge}) xqcL` : '';
			return {
				text: `${targetUser} is not subbed to xQc EZ ${isFollowing}`,
				reply: false,
			};
		} else if (cumulative?.months) {
			const isFollowing = followedAt ? `(Followed ${followAge}) xqcL` : '';
			const isSubbed = meta === null ? 'was previously' : 'is currently';
			return {
				text: `${targetUser} ${isSubbed} subbed to xQc for ${cumulative.months} months WutFace ${isFollowing}`,
				reply: false,
			};
		}
	},
};
