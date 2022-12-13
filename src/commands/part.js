const humanizeDuration = require('../util/humanizeDuration');

module.exports = {
	name: 'part',
	aliases: [],
	cooldown: 3000,
	description: 'Part channel command',
	execute: async (message, args, client) => {
		const { isChannel, addedBy } = await bot.DB.channels.findOne({ id: message.channelID }).exec();
		if (isChannel && addedBy.length > 0) {
			const { id, username, addedAt } = addedBy[0];
			if (id !== message.senderUserID && message.senderUserID !== message.channelID) {
				return {
					text: `You cannot part the bot from this channel, since only the Broadcaster or the Moderator ${username} that added the bot (${humanizeDuration(new Date() - addedAt, {
						largest: 3,
					})}) ago can do that.`,
				};
			}

			await bot.DB.channels.findOneAndUpdate({ id: message.channelID }, { $set: { isChannel: false } }).exec();
			try {
				await client.part(message.channelName);
				return {
					text: `Successfully parted from ${message.channelName}`,
				};
			} catch (err) {
				return {
					text: `Failed to part from ${message.channelName}`,
				};
			}
		}

		const channelData = await bot.DB.channels.findOneAndUpdate({ id: message.senderUserID }, { $set: { isChannel: false } }).exec();
		if (!channelData || !channelData.isChannel) {
			return { text: `Not in channel #${message.senderUsername}` };
		}

		if (channelData.isChannel) {
			try {
				await client.part(message.senderUsername);
				return { text: `Parting channel #${message.senderUsername}` };
			} catch (error) {
				return { text: `Error leaving channel #${message.senderUsername}` };
			}
		}
	},
};
