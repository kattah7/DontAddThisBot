const humanizeDuration = require('../misc/humanizeDuration.js');
const { ParseUser, IDByLogin } = require('../util/twitch/utils.js');
const { getUser, getUsernameByStvID, GlobalEmote } = require('../token/stvREST');
const { egVault } = require('../token/stvEGVAULT');

module.exports = {
	tags: '7tv',
	name: '7tvsa',
	cooldown: 5000,
	aliases: [],
	description: "Check user's 7tv subage YEAHBUT7TV",
	execute: async (client, msg) => {
		const Emote = GlobalEmote();
		const targetUser = ParseUser(msg.args[0] ?? msg.user.login);
		const uid = await IDByLogin(targetUser);
		if (uid === null) {
			return {
				text: `Unknown user`,
				reply: false,
			};
		}

		const result = await getUser(uid);
		if (result === null) {
			return {
				text: `${msg.args[0] ? 'User is' : 'You are'} not a 7tv user`,
				reply: true,
			};
		}

		const { active, end_at, renew, subscription, age } = await egVault(result.user.id);
		if (active) {
			const { customer_id, subscriber_id } = subscription;
			const ms = new Date().getTime() - Date.parse(end_at);
			const subDate = humanizeDuration(ms);
			const isRenew = renew == true ? 'renews' : 'is ending';
			const username = await getUsernameByStvID(customer_id);
			const gifter = customer_id !== subscriber_id ? `gifted by ${username.display_name}` : ' ';
			const subAge = age / 30;
			return {
				text: `${Emote} ${targetUser} sub ${gifter} ${isRenew} in ${subDate} [${subAge.toFixed(1)} Months]`,
				reply: false,
			};
		} else {
			return {
				text: `${Emote} ${targetUser} is not a 7tv sub`,
				reply: false,
			};
		}
	},
};
