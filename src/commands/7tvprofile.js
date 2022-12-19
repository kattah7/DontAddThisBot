const { getUser, GlobalEmote } = require('../token/stvREST');
const { ParseUser, IDByLogin } = require('../util/twitch/utils');
const { GetEditorOfChannels } = require('../token/stvGQL');
const humanizeDuration = require('../misc/humanizeDuration');

module.exports = {
	tags: '7tv',
	name: '7tv',
	cooldown: 5000,
	description: "Check user's 7tv info YEAHBUT7TV",
	aliases: [],
	execute: async (message, args, client) => {
		const Emote = GlobalEmote();
		const targetUser = await ParseUser(args[0] ?? message.senderUsername);
		const uid = await IDByLogin(targetUser);
		const stvInfo = await getUser(uid);
		if (!stvInfo || stvInfo === null) {
			return {
				text: `${Emote} - ${targetUser} UNKOWN USER`,
			};
		}

		const { user, emote_set } = stvInfo;
		const { id, created_at, roles } = user;
		const emoteSet = emote_set === null ? '' : `Emotes (${emote_set.emote_count}/${emote_set.capacity});`;
		const { editor_of } = (await GetEditorOfChannels(id)).user;
		const createdAt = humanizeDuration(new Date().getTime() - created_at, 2);
		const userRole = await bot.SQL.query(`SELECT * FROM stv_roles WHERE stv_role_id = '${roles[0]}'`);
		const { stv_role } = userRole.rows[0];

		return {
			text: `${Emote} - Created (${createdAt} Ago); ${emoteSet} Roles (${stv_role}); EditorsOf (${editor_of.length}); ID (${id})`,
		};
	},
};
