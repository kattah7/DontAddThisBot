const utils = require('../util/utils.js');

module.exports = {
	name: 'invest',
	description: 'invest poros in irl stocks',
	aliases: ['poroinvest'],
	cooldown: 10000,
	execute: async (message, args, client) => {
		var today = new Date().getHours();
		if (today >= 0 && today <= 24) {
			// The NYSE is open from Monday through Friday 9:30 a.m. to 4:00 p.m. NY Time.
			// BUT since this isnt real money, we are gonna include the weekends too
			// The bot will use UTC time, so we need to convert to New York Time
			// UTC is 4 hours ahead of New York Time, so we need to plus 4 hours of 9:30AM to 4:00PM
			// which is 13:30PM to 20:00PM
			// but idk how to do minutes too so we are just gonna do, today >= 13 && today <= 20
			if (!args[0]) {
				// if no user is provided
				if (message.senderUsername == (await utils.PoroNumberOne())) {
					client.privmsg(message.channelName, `.me Please provide a stock. PoroSad`);
				} else {
					return {
						text: `Please provide a stock. PoroSad`,
					};
				}
			}
			if (!args[1]) {
				// if no amount is provided
				if (message.senderUsername == (await utils.PoroNumberOne())) {
					client.privmsg(message.channelName, `.me Please provide amount. PoroSad`);
				} else {
					return {
						text: `Please provide amount. PoroSad`,
					};
				}
			}
			if (isNaN(args[1]) || args[1].startsWith('-', '+')) {
				// if amount is not a number
				if (message.senderUsername == (await utils.PoroNumberOne())) {
					client.privmsg(message.channelName, `.me Please provide a valid amount. PoroSad`);
				} else {
					return {
						text: `Please provide a valid amount. PoroSad`,
					};
				}
			}
			const investPoro = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
			const isInvesting = investPoro.invest.find((badge) => badge.id === message.senderUserID);
			if (isInvesting) {
				return {
					text: `You are already investing to ${isInvesting.stock} with ${isInvesting.amount} poros! type |claim to claim your poros!`,
				};
			} else {
				const isNull = await utils.Invest(args[0].toUpperCase());
				console.log(isNull);
				if (isNull == null || isNull.dp == null) {
					return {
						text: `"${args[0]}" is not a valid stock!`,
					};
				} else {
					const channelData = await bot.DB.poroCount
						.findOne({
							id: message.senderUserID,
						})
						.exec(); // Gets channel data for senderID
					if (channelData.poroCount >= 100) {
						if (channelData.poroCount >= args[1]) {
							await bot.DB.poroCount
								.updateOne(
									{
										id: message.senderUserID,
									},
									{
										$addToSet: {
											invest: [
												{
													username: message.senderUsername,
													id: message.senderUserID,
													stock: args[0].toUpperCase(),
													amount: args[1],
													investedAt: new Date(),
												},
											],
										},
									},
								)
								.exec();
							await bot.DB.poroCount
								.updateOne(
									{
										id: message.senderUserID,
									},
									{
										$set: {
											poroCount: channelData.poroCount - args[1],
										},
									},
									{
										multi: true,
									},
								)
								.exec();
							return {
								text: `You have invested ${args[1]} to "${args[0]}" kattahHappy ${channelData.poroCount - args[1]} poros left!`,
							};
						} else {
							return {
								text: `You don't have enough poros!`,
							};
						}
					} else {
						return {
							text: `You need to have at least 100 poros to invest!`,
						};
					}
				}
			}
		} else {
			return {
				text: `Sorry, but we are closed for the moment!`,
			};
		}
	},
};
