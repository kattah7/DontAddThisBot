const rwClient = require('../util/twitter/twitterClient.js');

module.exports = {
	tags: 'stats',
	name: 'tweet',
	cooldown: 5000,
	aliases: [],
	description: 'Tweet anything :) Check out your tweet twitter.com/twitchsayschat ',
	execute: async (client, msg) => {
		const tweet = async () => {
			try {
				await rwClient.v1.tweet(`${msg.user.display}: ${msg.args.join(' ')}`);
			} catch (e) {
				console.error(e);
			}
		};
		tweet();

		return {
			text: `Successfully tweeted kattahSpin Check out twitter.com/twitchsayschat to see your tweet`,
			reply: true,
		};
	},
};
