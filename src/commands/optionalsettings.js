module.exports = {
	tags: 'moderation',
	name: 'optional',
	aliases: [],
	description: 'Optional channel settings',
	cooldown: 5000,
	level: 3,
	async execute(client, msg) {
		if (!msg.args[0]) {
			return {
				text: `No Input Detected. Please provide a valid parameter.`,
				reply: true,
			};
		}

		await bot.DB.channels.findOneAndUpdate(
			{ username: msg.args[0] },
			{
				$set: {
					optionalSettings: {
						cooldown: Number(msg.args[1]),
						pajbot: msg.args[2],
					},
				},
			},
		);

		return {
			text: `Optional settings updated.`,
		};
	},
};
