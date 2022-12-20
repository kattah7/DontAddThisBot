const humanizeDuration = require('../misc/humanizeDuration');
const { ParseUser, IDByLogin } = require('../util/twitch/utils');
const { PoroGive } = require('../util/discord/discord');

module.exports = {
	tags: 'poro',
	name: 'porogive',
	aliases: ['give', 'send'],
	cooldown: 5000,
	description: 'Give poro to other user',
	execute: async (client, msg) => {
		const { id: senderUserID, login: senderUsername } = msg.user;
		const { login: channelName } = msg.channel;
		if (!msg.args[0]) {
			return {
				text: `Please provide a user. PoroSad`,
				reply: false,
			};
		}
		if (!msg.args[1]) {
			return {
				text: `Please provide amount. PoroSad`,
				reply: false,
			};
		}
		if (isNaN(msg.args[1]) || msg.args[1].startsWith('-')) {
			return {
				text: `Please provide a valid amount. PoroSad`,
				reply: false,
			};
		}
		const parseUser = await ParseUser(msg.args[0]);
		const recieverID = await IDByLogin(parseUser);
		if (!recieverID) {
			return {
				text: `User not found. PoroSad`,
				reply: false,
			};
		}
		const channelData = await bot.DB.poroCount.findOne({ id: senderUserID }).exec(); // Gets channel data for senderID
		if (!channelData) {
			return {
				text: `You aren't registered. PoroSad type |poro to get started kattahDance`,
				reply: false,
			};
		}
		var today = new Date();
		const timestamp = new Date(channelData.joinedAt);
		const diffTime = Math.abs(today - timestamp);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const timeLeft = humanizeDuration(diffTime - 604800000);
		if (diffDays < 7) {
			return {
				text: `You must be registered for ${timeLeft} to use this command. kattahPoro`,
				reply: true,
			};
		}
		const channelData2 = await bot.DB.poroCount.findOne({ id: recieverID }).exec(); // Gets channel data for poro reciever's ID
		if (!channelData2) {
			return {
				text: `${msg.args[0]} isnt registered. PoroSad`,
				reply: true,
			};
		}
		const timestamp2 = new Date(channelData2.joinedAt);
		const diffTime2 = Math.abs(today - timestamp2);
		const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
		const timeLeft2 = humanizeDuration(diffTime2 - 604800000);
		if (diffDays2 < 7) {
			return {
				text: `${msg.args[0]} must be registered for ${timeLeft2} to recieve kattahPoro`,
				reply: true,
			};
		}
		const findBlacklisted = await bot.DB.users.findOne({ id: recieverID }).exec(); // Gets bot data for poro reciever's ID
		const sendAmount = parseInt(msg.args[1]); // sending amount
		const Amount = parseInt(channelData.poroCount); // senderID's poro count
		const Amount2 = parseInt(channelData2.poroCount); // recieverID's poro count
		if (findBlacklisted.level > 0) {
			if (recieverID !== senderUserID) {
				if (Amount >= sendAmount) {
					if (Amount >= 100) {
						await bot.DB.poroCount
							.updateOne(
								{
									id: senderUserID,
								},
								{
									$set: {
										poroCount: Amount - sendAmount,
									},
								},
								{
									multi: true,
								},
							)
							.exec();
						await PoroGive(senderUsername, channelName, parseUser, sendAmount);
						if (recieverID) {
							await bot.DB.poroCount
								.updateOne(
									{
										id: recieverID,
									},
									{
										$set: {
											poroCount: Amount2 + sendAmount,
										},
									},
									{
										multi: true,
									},
								)
								.exec();
						}
						await client.say(channelName, `${senderUsername}, You have ${Amount - sendAmount} now and ${msg.args[0]} has ${Amount2 + sendAmount}`);
					} else {
						await client.say(channelName, `${senderUsername}, You must have more than 100 poros kattahPoro`);
					}
				} else {
					await client.say(channelName, `You dont have enough poro to give ${sendAmount} to ${msg.args[0]} kattahPoro`);
				}
			} else {
				await client.say(channelName, `${senderUsername}, You can't give poro to yourself PoroSad`);
			}
		} else {
			await client.say(channelName, `${msg.args[0]} is blacklisted PoroSad`);
		}
	},
};
