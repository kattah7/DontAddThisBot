module.exports = {
	tags: 'moderation',
	name: 'vanish',
	aliases: ['v'],
	cooldown: 3000,
	description: 'hide yourself from chat',
	botPerms: 'mod',
	execute: async (message, args, client) => {
		client.privmsg(message.channelName, `.timeout ${message.senderUsername} 1s`);
	},
};
