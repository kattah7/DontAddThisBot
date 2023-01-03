const { ChangeDisplayName } = require('../token/gql');

module.exports = {
	tags: 'poro',
	name: 'changename',
	description: "Change the bot's name with 50 poro pts",
	cooldown: 5000,
	poroRequire: true,
	execute: async (client, msg) => {
		if (!msg.args[0]) {
			return {
				text: `Please insert a name!`,
				reply: true,
			};
		}

		if (!/^[dontaddthisbot]{14}$/i.test(msg.args[0])) {
			return {
				text: `You can only change the display name!`,
				reply: true,
			};
		}

		const channelData = await bot.DB.poroCount.findOne({ id: msg.user.id }).exec();
		if (channelData.poroCount < 50) {
			return {
				text: `Not enough poro meat! ${msg.user.login} kattahHappy You need 50 poro meat | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`,
				reply: false,
			};
		} else {
			const ChangeName = await ChangeDisplayName(msg.args[0]);
			if (ChangeName?.errors) {
				return {
					text: `Please try again later!`,
					reply: true,
				};
			}

			await channelData.updateOne({ $set: { poroCount: channelData.poroCount - 50 } }).exec();
			return {
				text: `Name Changed to "${msg.args[0]}"! PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount - 50} meat total! 🥩`,
				reply: true,
			};
		}
	},
};
