module.exports = {
	name: 'hint',
	level: 3,
	aliases: [],
	cooldown: 5000,
	execute: async (client, msg) => {
		const doesHintExist = await bot.DB.private.findOne({ code: 'code' }).exec();
		const Code = msg.args.join(' ');

		if (!doesHintExist) {
			try {
				const newCode = new bot.DB.private({
					code: 'code',
					todaysCode: Code,
				});
				await newCode.save();
				return {
					text: `new code set!`,
					reply: true,
				};
			} catch (err) {
				console.log(err);
			}
		} else {
			await bot.DB.private.updateOne({ code: 'code' }, { $set: { todaysCode: Code } }).exec();
			return {
				text: `code set!`,
				reply: true,
			};
		}
	},
};
