const utils = require('../util/twitch/utils.js');

module.exports = {
	name: 'botjoin',
	aliases: [],
	cooldown: 3000,
	level: 3,
	description: 'Join channel command',
	execute: async (message, args, client) => {
		const targetUser = await utils.ParseUser(args[0]);
		if (!args[0] || !/^[A-Z_\d]{2,30}$/i.test(targetUser)) {
			const isArgs = args[0] ? 'malformed username parameter' : 'Please provide a channel name';
			return {
				text: isArgs,
			};
		}
		const channelData = await bot.DB.channels.findOne({ id: await utils.IDByLogin(targetUser.toLowerCase()) }).exec();
		// if the channel already exists, return
		if (channelData) {
			if (channelData.isChannel) {
				return { text: `Already in channel #${targetUser}` };
			} else {
				try {
					await bot.DB.channels
						.findOneAndUpdate(
							{
								id: await utils.IDByLogin(targetUser.toLowerCase()),
							},
							{
								$set: {
									isChannel: true,
								},
							},
						)
						.exec();
					await client.join(targetUser.toLowerCase());
					return {
						text: `Re-Joining channel #${targetUser}`,
					};
				} catch (error) {
					return {
						text: `Error joining channel #${targetUser}`,
					};
				}
			}
		} else {
			try {
				await client.join(targetUser.toLowerCase());
			} catch (error) {
				return { text: `Error joining channel #${targetUser}` };
			}
			const newChannel = new bot.DB.channels({
				username: targetUser.toLowerCase(),
				id: await utils.IDByLogin(targetUser.toLowerCase()),
				joinedAt: Date.now(),
				isChannel: true,
			});
			await newChannel.save();
			await client.say(targetUser.toLowerCase(), `Joined channel, ${targetUser} kattahPoro Also check @DontAddThisBot panels for info!`);
			return { text: `Joined channel #${targetUser}` };
		}
	},
};
