const { startCmds } = require('../clients/modules/commands.js');

module.exports = {
	tags: 'moderation',
	name: 'disable',
	cooldown: 5000,
	aliases: ['enable'],
	description: 'Disable a command',
	permission: 1,
	async execute(client, msg) {
		return {
			text: `This command has been deprecated. Please use https://poros.lol/dashboard/${msg.channel.login}/default`,
			reply: true,
		};
	},
};
