const humanizeDuration = require('../misc/humanizeDuration');
const { code } = require('../util/twitch/porocodes.json');

module.exports = {
	tags: 'poro',
	name: 'redeem',
	cooldown: 5000,
	description: 'Redeem poro meat with speical codes',
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
		if (!msg.args[0]) {
			return {
				text: `insert code lol`,
				reply: true,
			};
		}
		const { poroCount, poroPrestige, poroRank } = msg.poro;
		const lastUsage = await bot.Redis.get(`pororedeem:${senderUserID}`);
		const input = msg.args[0];
		const availableBadges = [code];

		if (lastUsage) {
			if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 24) {
				const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 24;
				return {
					text: `You have already redeemed the code! Come back in ${humanizeDuration(ms)} for daily codes`,
					reply: true,
				};
			}
		}

		if (!availableBadges.includes(input)) {
			return {
				text: `Wrong code :p ${msg.mongoChannel?.optionalSettings?.pajbot ? 'Check the site for hint :)' : 'hint: https://poros.lol/code'}`,
				reply: true,
			};
		}

		await bot.DB.poroCount.updateOne({ id: senderUserID }, { $set: { poroCount: poroCount + 50 } }).exec();
		await bot.Redis.set(`pororedeem:${senderUserID}`, Date.now(), 0);
		return {
			text: `Code Redeemed! ${senderUsername} (+50) kattahDance2 total [P${poroPrestige}: ${displayPoroRankByName[poroRank]}] ${poroCount + 50} meat`,
			reply: false,
		};
	},
};
