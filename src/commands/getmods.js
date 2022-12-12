const got = require('got');
const utils = require('../util/twitch/utils.js');
const { GetChannelRoles } = require('../token/gql.js');

module.exports = {
	tags: 'stats',
	name: 'modvip',
	aliases: ['mv'],
	cooldown: 3000,
	async execute(message, args, client) {
		const targetUser = await utils.ParseUser(args[0] ?? message.channelName);
		if (!/^[A-Z_\d]{2,26}$/i.test(targetUser)) {
			return {
				text: 'malformed username parameter',
			};
		}
		try {
			const { body: getModsNVips } = await got.get(
				`https://api.ivr.fi/v2/twitch/modvip/${targetUser}?skipCache=false`,
				{
					throwHttpErrors: false,
					responseType: 'json',
					headers: {
						'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
					},
				},
			);
			const userID = await utils.IDByLogin(targetUser);
			const { data } = await GetChannelRoles(userID);
			const { artists } = data;
			const artistsMapped = artists.edges.map(({ node, grantedAt }) => ({
				id: node.id,
				login: node.login,
				displayName: node.displayName,
				grantedAt: grantedAt,
			}));
			const modsMapped = getModsNVips.mods.map(
				(x) =>
					x.login +
					' (' +
					x.grantedAt.split('T')[0] +
					')' +
					' - ' +
					'[MOD]',
			);
			const vipsMapped = getModsNVips.vips.map(
				(x) =>
					x.login +
					' (' +
					x.grantedAt.split('T')[0] +
					')' +
					' - ' +
					'[VIP]',
			);
			const artistMapped = artistsMapped.map(
				(x) =>
					x.login +
					' (' +
					x.grantedAt.split('T')[0] +
					')' +
					' - ' +
					'[ARTIST]',
			);
			const modsNvipsMapped = modsMapped.concat(vipsMapped, artistMapped);
			const { key } = await got
				.post(`https://paste.ivr.fi/documents`, {
					responseType: 'json',
					body: modsNvipsMapped.join('\n'),
				})
				.json();
			return {
				text: `https://paste.ivr.fi/${key} - [${modsMapped.length} mods, ${vipsMapped.length} vips, ${artistMapped.length} artists]`,
			};
		} catch (e) {
			console.log(e);
			return {
				text: 'error',
			};
		}
	},
};
