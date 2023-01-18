module.exports = {
	tags: 'stats',
	name: 'search',
	aliases: ['google'],
	cooldown: 3000,
	description: 'google anything!',
	execute: async (message, args, client) => {
		return {
			text: `${message.senderUsername}, https://www.google.com/search?q=${args.join('+')}`,
		};
	},
};
