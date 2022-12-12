module.exports = {
	tags: 'stats',
	name: 'commands',
	aliases: ['commands'],
	cooldown: 3000,
	execute: async (message, args, client) => {
		return {
			text: `${message.senderUsername}, https://docs.poros.lol/global-commands WutFace`,
		};
	},
};
