const humanizeDuration = require('../misc/humanizeDuration');

module.exports = {
	name: 'part',
	aliases: [],
	cooldown: 3000,
	description: 'Part channel command',
	execute: async (client, msg) => {
		return {
			text: 'This command has been deprecated. Please use https://poros.lol',
			reply: true,
		};
	},
};
