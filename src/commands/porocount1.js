const humanizeDuration = require('../misc/humanizeDuration');
const { ParseUser, IDByLogin } = require('../util/twitch/utils.js');

module.exports = {
	tags: 'poro',
	name: 'porocount',
	cooldown: 5000,
	aliases: ['poros'],
	description: 'check poro count of user',
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

		const { login: senderUsername } = msg.user;
		const targetUser = ParseUser(msg.args[0] ?? senderUsername);
		const targetUserID = await IDByLogin(targetUser);
		const selfPoroData = await bot.DB.poroCount.findOne({ id: targetUserID });
		if (!selfPoroData) {
			const pronouns = msg.args.length > 0 ? `PoroSad @${targetUser} isnt registered!` : `PoroSad you arent registered! ${senderUsername} type ${msg.prefix ?? `|`}poro to get started.`;
			return {
				text: pronouns,
				reply: false,
			};
		}

		const { poroCount, poroPrestige, joinedAt, poroRank } = selfPoroData;
		const parsedTime = Math.abs(new Date().getTime() - new Date(joinedAt).getTime());
		const successPronouns =
			msg.args.length > 0
				? `${targetUser} => [P${poroPrestige}: ${displayPoroRankByName[poroRank]}] ${poroCount} poro(s). kattahDance Registered (${humanizeDuration(parsedTime)})`
				: `${senderUsername} => [P${poroPrestige}: ${displayPoroRankByName[poroRank]}] ${poroCount} poro(s). kattahDance Registered (${humanizeDuration(parsedTime)})`;
		return {
			text: successPronouns,
			reply: false,
		};
	},
};
