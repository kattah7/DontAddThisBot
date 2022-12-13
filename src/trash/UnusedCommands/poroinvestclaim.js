const utils = require('../util/utils.js');

module.exports = {
	name: 'claim',
	description: 'claim poros for stocks',
	aliases: ['poroclaim'],
	cooldown: 10000,
	execute: async (message, args, client) => {
		var today = new Date().getHours();
		if (today >= 0 && today <= 24) {
			// The NYSE is open from Monday through Friday 9:30 a.m. to 4:00 p.m. NY Time.
			const investPoro = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
			const isInvesting = investPoro.invest.find((badge) => badge.id === message.senderUserID);
			if (isInvesting) {
				const stocks = await utils.Invest(investPoro.invest[0].stock);
				var growth = stocks.dp; // 0.0599
				const data = Number(investPoro.invest[0].amount * growth) + Number(investPoro.invest[0].amount); // 100 * 0.0599 + 100 = 105.99
				console.log(data); // it should give 105 but it logs 5.99100
				const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec(); // Gets channel data for senderID
				const thePoros = Math.abs(Math.floor(data));
				await bot.DB.poroCount
					.updateOne(
						{ id: message.senderUserID },
						{
							$pull: {
								invest: {
									id: message.senderUserID,
								},
							},
						},
					)
					.exec();
				await bot.DB.poroCount
					.updateOne(
						{ id: message.senderUserID },
						{
							$set: {
								poroCount: channelData.poroCount + thePoros,
							},
						},
						{ multi: true },
					)
					.exec();
				return {
					text: `You have claimed your poro! ${thePoros} Added kattahHappy`,
				};
			} else {
				return {
					text: `You are not investing!`,
				};
			}
		} else {
			return {
				text: `Sorry, but we are closed for the moment!`,
			};
		}
	},
};
