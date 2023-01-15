module.exports = {
	name: 'join',
	aliases: [],
	cooldown: 3000,
	description: 'Join channel command',
	execute: async (client, msg) => {
		return {
			text: 'This command has been deprecated. Please use https://poros.lol',
			reply: true,
		};
	},
};
