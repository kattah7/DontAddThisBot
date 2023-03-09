const { ParseUser, IDByLogin } = require('../util/twitch/utils');
const { PoroGive } = require('../util/discord/discord');

module.exports = {
	tags: 'poro',
	name: 'porogive',
	aliases: ['give', 'send'],
	cooldown: 5000,
	poroRequire: true,
	description: 'Give poro to other user',
	execute: async (client, msg) => {
		if (!msg.args[0] && !msg.args[1]) {
			return {
				text: `Please provide a user and amount. PoroSad ex: |porogive kattah 100`,
				reply: true,
			};
		}

		if (isNaN(msg.args[1]) || msg.args[1].startsWith('-')) {
			return {
				text: `Please provide a valid amount. PoroSad`,
				reply: true,
			};
		}

		const parseUser = ParseUser(msg.args[0]);
		const targetUser = await IDByLogin(parseUser);
		if (!targetUser) {
			return {
				text: `User not found. PoroSad`,
				reply: true,
			};
		}

		if (targetUser === msg.poro.id) {
			return {
				text: `You cant give poro to yourself. PoroSad`,
				reply: true,
			};
		}

		const checkLevel = await bot.DB.users.findOne({ id: targetUser }).exec();
		if (checkLevel?.level < 1 || !checkLevel) {
			const isBlacklisted = !checkLevel ? 'User was never seen before.' : 'User is blacklisted.';
			return {
				text: `${isBlacklisted} PoroSad`,
				reply: true,
			};
		}

		const Reciever = await bot.DB.poroCount.findOne({ id: targetUser }).exec();
		if (!Reciever) {
			return {
				text: `User isnt registered. PoroSad`,
				reply: true,
			};
		}

		if (msg.poro.poroCount < msg.args[1]) {
			return {
				text: `You dont have enough poro to give ${msg.args[1].toLocaleString()} to ${parseUser} kattahPoro`,
				reply: true,
			};
		}

		let taxPercentage = msg.poro.poroPrestige;
		let taxAmount = 0;
		const sendingAmount = Number(msg.args[1]);
		if (msg.poro.poroPrestige > 0 || sendingAmount > 5000) {
			if (sendingAmount >= 5000) {
				taxPercentage += Math.floor(sendingAmount / 5000);
			}

			if (taxPercentage > 55) {
				taxPercentage = 55;
			}

			const newSenderPoroMinusPercent = sendingAmount - (sendingAmount * taxPercentage) / 100;
			taxAmount = Math.floor(newSenderPoroMinusPercent);
		} else {
			taxAmount = Number(msg.args[1]);
		}

		const newSenderPoro = msg.poro.poroCount - Number(msg.args[1]);
		const newRecieverPoro = Reciever.poroCount + Number(taxAmount);

		await bot.DB.poroCount.updateOne({ id: msg.poro.id }, { $set: { poroCount: newSenderPoro } }, { multi: true }).exec();
		await bot.DB.poroCount.updateOne({ id: Reciever.id }, { $set: { poroCount: newRecieverPoro } }, { multi: true }).exec();

		const isTaxed = taxAmount > 0 ? `(${taxPercentage}% Fees)` : '';
		await PoroGive(msg.user.login, msg.channel.login, parseUser, msg.args[1]);
		return {
			text: `You have ${newSenderPoro.toLocaleString()} and ${parseUser} now has ${newRecieverPoro.toLocaleString()} kattahPoro ${isTaxed}`,
			reply: true,
		};
	},
};
