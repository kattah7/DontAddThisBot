module.exports = {
	tags: 'moderation',
	name: 'offlineonly',
	cooldown: 3000,
	description: 'Make the bot only type when channel is offline',
	permission: 2,
	aliases: [],
	offline: true,
	execute: async (client, msg) => {
		async function setStatus(channelID, Boolean) {
			await bot.DB.channels
				.updateOne(
					{ id: channelID },
					{
						$set: {
							offlineOnly: Boolean,
						},
					},
				)
				.exec();
		}

		const user = await bot.DB.channels.findOne({ id: msg.channel.id }).exec();
		if (user?.offlineOnly) {
			try {
				await setStatus(msg.channel.id, false);
				return {
					text: `${msg.channel.login} is now online & offline only`,
					reply: false,
				};
			} catch (err) {
				return {
					text: 'Failed to update database',
					reply: false,
				};
			}
		}
		if (!user.offlineOnly) {
			try {
				await setStatus(msg.channel.id, true);
				return {
					text: `${msg.channel.login} is now offline only`,
					reply: false,
				};
			} catch (err) {
				return {
					text: 'Failed to update database',
					reply: false,
				};
			}
		}
	},
};
