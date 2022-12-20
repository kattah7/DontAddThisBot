const got = require('got');
const humanizeDuration = require('../misc/humanizeDuration');

module.exports = {
	tags: 'stats',
	name: 'bored',
	cooldown: 5000,
	aliases: [],
	description: 'Get stuff to do every 12 hours',
	execute: async (client, msg) => {
		console.log(msg);
		const lastUsage = await bot.Redis.get(`test:${msg.user.id}`);
		let { body: userData, statusCode } = await got(`http://www.boredapi.com/api/activity?participants=1`, {
			timeout: 10000,
			throwHttpErrors: false,
			responseType: 'json',
		});

		if (lastUsage) {
			if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 12) {
				const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 12;
				return {
					text: `This command can only be used every 12hours. Please wait ${humanizeDuration(ms)}.`,
					reply: true,
				};
			}
		}

		await bot.Redis.set(`test:${msg.user.id}`, Date.now(), 0);
		return {
			text: `${userData.activity}`,
			reply: true,
		};
	},
};
