const { ParseUser, IDByLogin } = require('../util/twitch/utils.js');

module.exports = {
	name: 'botpart',
	aliases: [],
	cooldown: 3000,
	kattah: true,
	description: 'Part channel command (level 3 only)',
	execute: async (client, msg) => {
		const targetUser = ParseUser(msg.args[0]);
		if (!targetUser || !/^[A-Z_\d]{3,25}$/i.test(targetUser)) {
			const isArgs = targetUser ? 'malformed username parameter' : 'Please provide a channel name';
			return {
				text: isArgs,
				reply: false,
			};
		}

		const targetUserID = await IDByLogin(targetUser);
		const channelData = await bot.DB.channels.findOneAndUpdate({ id: targetUserID }, { $set: { isChannel: false } }).exec();

		if (!channelData || !channelData.isChannel) {
			return { text: `Not in channel #${targetUser}`, reply: false };
		}

		if (channelData.isChannel) {
			try {
				await client.part(targetUser);
				return { text: `Parting channel #${targetUser}`, reply: false };
			} catch (error) {
				return { text: `Error leaving channel #${targetUser}`, reply: false };
			}
		}
	},
};
