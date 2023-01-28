module.exports = {
	name: 'part',
	aliases: [],
	cooldown: 3000,
	description: 'Part channel command',
	execute: async (client, msg) => {
		const { addedBy, isChannel } = msg.mongoChannel;
		if (addedBy.length > 0 && isChannel) {
			const whoAdded = msg.mongoChannel.addedBy[0];
			if (whoAdded.id === msg.user.id || whoAdded.id === msg.channel.id) {
				await client.part(msg.channel.login);
				await bot.DB.channels.findOneAndUpdate({ id: msg.channel.id }, { $set: { isChannel: false } }).exec();

				return {
					text: `I have left ${msg.channel.login} as you requested.`,
					reply: true,
				};
			}
		}

		return {
			text: 'This command has been deprecated. Please use https://poros.lol',
			reply: true,
		};
	},
};
