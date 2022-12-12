const { UserInfo } = require('../token/helix');
const { ViewerList } = require('../token/gql');

module.exports = {
	tags: 'stats',
	name: 'randombio',
	description: 'gets random bio in the channel',
	cooldown: 3000,
	aliases: ['rb'],
	execute: async (message, args, client) => {
		const { chatters } = await ViewerList('kattah');
		const push = [];
		chatters.moderators.map((mod) => {
			push.push(mod.login);
		});
		chatters.viewers.map((view) => {
			push.push(view.login);
		});
		chatters.vips.map((vip) => {
			push.push(vip.login);
		});
		const randomUser = push[Math.floor(Math.random() * push.length)];
		const { description } = (await UserInfo(randomUser))[0];

		if (description == '') {
			return {
				text: `Unlucky! user doesn't have a bio FeelsDankMan`,
			};
		} else {
			return {
				text: `${description}`,
			};
		}
	},
};
