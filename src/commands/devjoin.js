const { ParseUser, IDByLogin } = require('../util/twitch/utils.js');

module.exports = {
	name: 'botjoin',
	aliases: [],
	cooldown: 3000,
	level: 3,
	description: 'Join channel command',
	execute: async (client, msg) => {
		async function createUser(targetUser, targetUserID) {
			const newChannel = new bot.DB.channels({
				username: targetUser,
				id: targetUserID,
				joinedAt: Date.now(),
				isChannel: true,
			});
			await newChannel.save();
		}

		async function reJoinChannel(targetUserID) {
			await bot.DB.channels
				.findOneAndUpdate(
					{
						id: targetUserID,
					},
					{
						$set: {
							isChannel: true,
						},
					},
				)
				.exec();
		}

		const targetUser = ParseUser(msg?.args[0]);
		if (!targetUser || !/^[A-Z_\d]{2,30}$/i.test(targetUser)) {
			const isArgs = targetUser ? 'malformed username parameter' : 'Please provide a channel name';
			return {
				text: isArgs,
				reply: true,
			};
		}

		const targetUserID = await IDByLogin(targetUser);
		const channelData = await bot.DB.channels.findOne({ id: targetUserID }).exec();

		if (channelData) {
			if (channelData.isChannel) {
				return { text: `Already in channel #${targetUser}`, reply: false };
			} else {
				try {
					await client.join(targetUser);
					await reJoinChannel(targetUserID);
					return {
						text: `Re-Joining channel #${targetUser}`,
						reply: false,
					};
				} catch (error) {
					return {
						text: `Error joining channel #${targetUser}`,
						reply: false,
					};
				}
			}
		} else {
			try {
				await client.join(targetUser);
				await createUser(targetUser, targetUserID);
				await client.say(targetUser, `Joined channel, ${targetUser} kattahPoro Also check @DontAddThisBot panels for info!`);
			} catch (error) {
				return { text: `Error joining channel #${targetUser}`, reply: false };
			}
			return { text: `Joined channel #${targetUser}`, reply: false };
		}
	},
};
