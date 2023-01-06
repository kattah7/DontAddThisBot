const utils = require('../util/twitch/utils.js');

module.exports = {
	tags: '7tv',
	name: '7tveditor',
	description: 'Usage: |editor add/remove <username>',
	aliases: ['editor'],
	cooldown: 3000,
	permission: 2,
	async execute(client, msg) {
		if (!msg.args[0]) {
			return {
				text: 'Usage: |editor add/remove <username>',
				reply: true,
			};
		}
		if (msg.args[0] !== 'add' && msg.args[0] !== 'remove') {
			return {
				text: 'Usage: |editor add/remove <username>',
			};
		}
		if (!msg.args[1]) {
			return {
				text: 'Usage: |editor add/remove <username>',
				reply: true,
			};
		}
		if (msg.args[1] == msg.channel.login) {
			return {
				text: "You can't add yourself to the editor list!",
				reply: true,
			};
		}

		const user = msg.args[1].toLowerCase();
		const uid = await utils.IDByLogin(await utils.ParseUser(user));
		if (uid == null) {
			return {
				text: `Could not find user "${user}"`,
				reply: true,
			};
		}

		if (msg.args[0] == 'add') {
			const channel = await bot.DB.channels
				.findOne({
					username: msg.channel.login,
				})
				.exec();
			const findChannelEditors = channel.editors.find((editors) => editors.id === uid);
			if (findChannelEditors) {
				return {
					text: `User "${user}" is already an editor...`,
					reply: true,
				};
			} else {
				await bot.DB.channels
					.updateOne(
						{
							id: msg.channel.id,
						},
						{
							$addToSet: {
								editors: [
									{
										username: await utils.ParseUser(user),
										id: uid,
										grantedAt: new Date(),
									},
								],
							},
						},
					)
					.exec();
				return {
					text: `Added "${user}" as an editor in this channel!`,
					reply: true,
				};
			}
		}
		if (msg.args[0] == 'remove') {
			const channel = await bot.DB.channels
				.findOne({
					id: msg.channel.id,
				})
				.exec();
			const tc = channel.editors.find((badge) => badge.id === uid);
			if (!tc) {
				return {
					text: `User "${user}" is not an editor...`,
					reply: true,
				};
			} else {
				await bot.DB.channels
					.updateOne(
						{
							id: msg.channel.id,
						},
						{
							$pull: {
								editors: {
									id: uid,
								},
							},
						},
					)
					.exec();
				return {
					text: `Removed "${user}" as an editor in this channel!`,
					reply: true,
				};
			}
		}
	},
};
