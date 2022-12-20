const { ParseUser, IVRByLogin } = require('../util/twitch/utils');
const { ChangeColor } = require('../token/helix');
const { color } = require('../util/twitch/botcolor.json');

module.exports = {
	tags: 'stats',
	name: 'color',
	cooldown: 3000,
	aliases: [],
	description: "Gets user's chat color",
	execute: async (client, msg) => {
		async function changeChatColor(chatColor, botColor) {
			await ChangeColor(chatColor);
			await new Promise((resolve) => setTimeout(resolve, 30));
			await client.privmsg(msg.channel.login, `.me @${msg.user.login}, ████ ${chatColor}`);
			await new Promise((resolve) => setTimeout(resolve, 30));
			await ChangeColor(botColor);
		}

		const targetUser = await ParseUser(msg.args[0] ?? msg.user.login);
		if (msg.args[0]) {
			const user = await IVRByLogin(targetUser);
			if (user === null || user.chatColor === null) {
				return {
					text: `${targetUser} does not have a chat color set. WutFace`,
					reply: true,
				};
			}

			try {
				changeChatColor(user.chatColor, color);
				return;
			} catch (err) {
				return {
					text: `Failed to get ${targetUser}'s chat color.`,
					reply: true,
				};
			}
		}

		if (!msg.user.colorRaw || msg.user.colorRaw === null) {
			return {
				text: `You do not have a chat color set. WutFace`,
				reply: true,
			};
		}

		return await changeChatColor(msg?.user.colorRaw, color);
	},
};
