const humanizeDuration = require('../misc/humanizeDuration');

module.exports = {
	tags: 'poro',
	name: 'cdr',
	description: 'cooldown reset timer',
	cooldown: 3000,
	aliases: [],
	poroRequire: true,
	execute: async (client, msg) => {
		const displayPoroRankByName = {
			1: 'Raw',
			2: 'Rare',
			3: 'Medium Rare',
			4: 'Medium',
			5: 'Medium Well',
			6: 'Well Done',
			7: 'Cooked',
		};

		const { id: senderUserID, login: senderUsername } = msg.user;
		const lastUsage = await bot.Redis.get(`porocdr:${senderUserID}`);
		const channelData = await bot.DB.poroCount.findOne({ id: senderUserID }).exec();
		const { poroCount, poroPrestige, poroRank } = channelData;
		if (lastUsage && channelData) {
			if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 3) {
				const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 3;
				return {
					text: `Please wait ${humanizeDuration(ms)} before doing another cooldown reset! PoroSad`,
					reply: false,
				};
			}
		}
		await bot.DB.poroCount.updateOne({ id: senderUserID }, { $set: { poroCount: poroCount - 5 } }).exec();
		await bot.Redis.set(`porocdr:${senderUserID}`, Date.now(), 0);
		await bot.Redis.del(`poro:${senderUserID}`);
		return {
			text: `Timer Reset! ${senderUsername} (-5) kattahPoro total [P${poroPrestige}: ${displayPoroRankByName[poroRank]}] ${poroCount - 5} meat`,
			reply: false,
		};
	},
};
