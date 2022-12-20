const { UserInfo } = require('../token/helix');
const { ViewerList } = require('../token/gql');

module.exports = {
	tags: 'stats',
	name: 'randombio',
	description: 'gets random bio in the channel',
	cooldown: 3000,
	aliases: ['rb'],
	execute: async (client, msg) => {
		async function returnRandom(channelID) {
			const { chatters } = await ViewerList(channelID);
			const push = [];
			for (const chatter of [...chatters.broadcasters, ...chatters.moderators, ...chatters.vips, ...chatters.viewers]) {
				push.push(chatter.login);
			}
			const randomUser = push[Math.floor(Math.random() * push.length)];
			return randomUser;
		}

		const randomUser = await returnRandom(msg.channel.login);
		const { description } = (await UserInfo(randomUser))[0];
		if (!description) {
			for (let i = 0; i < 5; i++) {
				const randomUserAgain = await returnRandom(msg.channel.login);
				const { description: newDesc } = (await UserInfo(randomUserAgain))[0];
				if (newDesc) {
					return {
						text: `${randomUserAgain}'s bio: ${newDesc}`,
						reply: true,
					};
				}
			}
		}

		return {
			text: `${randomUser}'s bio: ${description}`,
			reply: true,
		};
	},
};
