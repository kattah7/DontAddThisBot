const got = require('got');

module.exports = {
	name: 'lastseen',
	aliases: ['ls'],
	cooldown: 3000,
	description: 'Check last seen of a user in a chat',
	execute: async (message, args, client) => {
		const targetUser = args[0] ?? message.senderUsername;
		const targetChannel = args[1] ?? message.channelName;
		let { body: userData, statusCode } = await got(
			`https://api.ivr.fi/logs/lastmessage/${targetChannel}/${targetUser}`,
			{ timeout: 10000, throwHttpErrors: false, responseType: 'json' },
		);
		const lastseen = userData.time;
		return {
			text: `${targetUser} was last seen ${lastseen} ago in ${targetChannel}.`,
		};
	},
};
