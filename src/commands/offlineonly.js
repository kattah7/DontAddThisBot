module.exports = {
	tags: 'moderation',
	name: 'offlineonly',
	cooldown: 3000,
	description: 'Make the bot only type when channel is offline',
	permission: 2,
	aliases: [],
	offline: true,
	execute: async (client, msg) => {
		return {
			text: `This command has been deprecated. Please use https://poros.lol/dashboard/${msg.channel.login}/channel/settings`,
			reply: true,
		};
	},
};
