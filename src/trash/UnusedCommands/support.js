module.exports = {
	tags: 'stats',
	name: 'support',
	aliases: ['donate'],
	cooldown: 3000,
	description: 'If you would like to help my monthly server cost TriHard',
	execute: async (message, args, client) => {
		return {
			text: `${message.senderUsername}, https://ko-fi.com/kattah ☕ If you would like to help upkeep server cost for the bot :) <3 SUPPORTERS: @Fromo__ `,
		};
	},
};
