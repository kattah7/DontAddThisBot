module.exports = {
	name: 'join',
	aliases: [],
	cooldown: 3000,
	description: 'Join channel command',
	execute: async (message, args, client) => {
		// try to get the channel from the database
		const channelData = await bot.DB.channels.findOne({ id: message.senderUserID }).exec();
		const poroData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
		if (channelData) {
			if (channelData.isChannel) {
				return { text: `Already in channel #${message.senderUsername}` };
			} else {
				try {
					await bot.DB.channels
						.findOneAndUpdate(
							{
								id: message.senderUserID,
							},
							{
								$set: {
									isChannel: true,
								},
							},
						)
						.exec();
					await client.join(message.senderUsername);
					return {
						text: `Re-Joining channel #${message.senderUsername}`,
					};
				} catch (error) {
					return {
						text: `Error joining channel #${message.senderUsername}`,
					};
				}
			}
		} else {
			try {
				await client.join(message.senderUsername);
			} catch (error) {
				return { text: `Error joining channel #${message.senderUsername}` };
			}

			const newChannel = new bot.DB.channels({
				username: message.senderUsername,
				id: message.senderUserID,
				joinedAt: Date.now(),
				isChannel: true,
			});

			await newChannel.save();
			await client.say(
				message.senderUsername,
				`Joined channel, ${message.senderUsername} kattahPoro Check the bot's panels or https://docs.poros.lol for info!`,
			);
			if (poroData) {
				await bot.DB.poroCount
					.updateOne(
						{ id: message.senderUserID },
						{
							$set: {
								poroCount:
									poroData.poroCount +
									100,
							},
						},
					)
					.exec();
				return {
					text: `Joined channel #${message.senderUsername} also gave u free 100 poros!!`,
				};
			} else {
				return { text: `Joined channel #${message.senderUsername}` };
			}
		}
	},
};
