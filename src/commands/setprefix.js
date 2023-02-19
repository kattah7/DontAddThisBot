module.exports = {
	tags: 'moderation',
	name: 'setprefix',
	description: 'changes the bot prefix for your channel (default is "|")',
	cooldown: 3000,
	permission: 2,
	aliases: [],
	usage: '<prefix>',
	async execute(client, msg) {
		return {
			text: `This command has been deprecated. Please use https://poros.lol/dashboard/${msg.channel.login}/channel/settings`,
			reply: true,
		};
	},
};
