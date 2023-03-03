const { IVRByLogin } = require('../util/twitch/utils.js');

module.exports = {
	tags: '7tv',
	name: 'deveditor',
	description: 'Usage: |editor add/remove <username>',
	aliases: [''],
	cooldown: 5000,
	kattah: true,
	async execute(client, msg) {
		if (!msg.args) {
			return {
				text: 'No args provided',
				reply: true,
			};
		}

		if (!msg.args[1]) {
			return {
				text: 'No username provided',
				reply: true,
			};
		}

		const targerUser = msg.args[0].toLowerCase();
		const type = msg.args[1];

		const getUserId = await IVRByLogin(targerUser);
		if (!getUserId) {
			return {
				text: 'User not found',
				reply: true,
			};
		}

		const actualId = getUserId.id;
		if (type === 'add') {
			const findEditor = msg.mongoChannel.editors.find((e) => e.id === actualId);
			if (findEditor) {
				return {
					text: `${targerUser} is already an editor`,
					reply: true,
				};
			}

			try {
				await msg.mongoChannel.updateOne({ $addToSet: { editors: { id: actualId, username: targerUser, grantedAt: new Date() } } });
				return {
					text: `${targerUser} is now an editor in ${msg.channel.login}`,
					reply: true,
				};
			} catch (err) {
				return {
					text: 'Internal Server Error',
					reply: true,
				};
			}
		} else if (type === 'remove') {
			const findEditor = msg.mongoChannel.editors.find((e) => e.id === actualId);
			if (!findEditor) {
				return {
					text: `${targerUser} is not an editor`,
					reply: true,
				};
			}

			try {
				await msg.mongoChannel.updateOne({ $pull: { editors: { id: actualId } } });
				return {
					text: `${targerUser} is no longer an editor in ${msg.channel.login}`,
					reply: true,
				};
			} catch (err) {
				return {
					text: 'Internal Server Error',
					reply: true,
				};
			}
		}

		return {
			text: 'Invalid type',
			reply: true,
		};
	},
};
