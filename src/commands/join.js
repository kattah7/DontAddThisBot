module.exports = {
	name: 'join',
	aliases: [],
	cooldown: 3000,
	description: 'Join channel command',
	execute: async (client, msg) => {
		const channelData = await bot.DB.channels.findOne({ id: msg.user.id }).exec();
		const poroData = await bot.DB.poroCount.findOne({ id: msg.user.id }).exec();
		if (channelData) {
			if (channelData.isChannel) {
				return { text: `Already in channel #${msg.user.login}` };
			} else {
				try {
					await ReJoinChannel(msg.user.id);
					await client.join(msg.user.login);
					return {
						text: `Re-Joining channel #${msg.user.login}`,
						reply: false,
					};
				} catch (error) {
					return {
						text: `Error joining channel #${msg.user.login}`,
						reply: false,
					};
				}
			}
		} else {
			try {
				await client.join(msg.user.login);
				const Result = await JoinChannel(msg.user.login, msg.user.id);
				return {
					text: Result.text,
					reply: false,
				};
			} catch (error) {
				return { text: `Error joining channel #${msg.user.login}` };
			}
		}

		async function ReJoinChannel(senderUserID) {
			await bot.DB.channels
				.findOneAndUpdate(
					{
						id: senderUserID,
					},
					{
						$set: {
							isChannel: true,
						},
					},
				)
				.exec();
		}

		async function JoinChannel(senderUsername, senderUserID) {
			const newChannel = new bot.DB.channels({
				username: senderUsername,
				id: senderUserID,
				joinedAt: Date.now(),
				isChannel: true,
			});

			await newChannel.save();
			await client.say(senderUsername, `Joined channel, ${senderUsername} kattahPoro Check the bot's panels or https://docs.poros.lol for info!`);

			if (poroData) {
				await bot.DB.poroCount
					.updateOne(
						{ id: senderUserID },
						{
							$set: {
								poroCount: poroData.poroCount + 100,
							},
						},
					)
					.exec();
				return {
					text: `Joined channel #${senderUsername} also gave u free 100 poros!!`,
					reply: false,
				};
			} else {
				return { text: `Joined channel #${senderUsername}`, reply: false };
			}
		}
	},
};
