const humanizeDuration = require('../misc/humanizeDuration');

module.exports = {
	name: 'part',
	aliases: [],
	cooldown: 3000,
	description: 'Part channel command',
	execute: async (client, msg) => {
		const { isChannel, addedBy } = await bot.DB.channels.findOne({ id: msg.channel.id }).exec();
		if (isChannel && addedBy.length > 0) {
			const { id, username, addedAt } = addedBy[0];
			if (id !== msg.user.id && msg.user.id !== msg.channel.id) {
				return {
					text: `You cannot part the bot from this channel, since only the Broadcaster or the Moderator ${username} that added the bot (${humanizeDuration(new Date() - addedAt, {
						largest: 3,
					})}) ago can do that.`,
				};
			}

			await bot.DB.channels.findOneAndUpdate({ id: msg.channel.id }, { $set: { isChannel: false } }).exec();
			try {
				await client.part(msg.channel.login);
				return {
					text: `Successfully parted from ${msg.channel.login}`,
				};
			} catch (err) {
				return {
					text: `Failed to part from ${msg.channel.login}`,
				};
			}
		}

		const channelData = await bot.DB.channels.findOneAndUpdate({ id: msg.user.id }, { $set: { isChannel: false } }).exec();
		if (!channelData || !channelData.isChannel) {
			return { text: `Not in channel #${msg.user.login}` };
		}

		if (channelData.isChannel) {
			try {
				await client.part(msg.user.login);
				return { text: `Parting channel #${msg.user.login}` };
			} catch (error) {
				return { text: `Error leaving channel #${msg.user.login}` };
			}
		}
	},
};
