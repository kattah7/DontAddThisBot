module.exports = {
	name: 'setcode',
	cooldown: 5000,
	description: 'check poro count of user',
	aliases: [],
	level: 3,
	execute: async (client, msg) => {
		if (!msg.args[0]) {
			return {
				text: `insert code lol`,
			};
		}

		const code = msg.args.join(' ');
		await bot.Redis.set(`poroCode`, code, 0);

		return {
			text: `Code set!`,
			reply: true,
		};
	},
};
