const got = require('got');
const { ParseUser, IDByLogin } = require('../util/twitch/utils.js');
const { GetChannelRoles } = require('../token/gql.js');

module.exports = {
	tags: 'stats',
	name: 'modvip',
	aliases: ['mv'],
	cooldown: 3000,
	async execute(client, msg) {
		const targetUser = ParseUser(msg.args[0] ?? msg.channel.login);
		if (!/^[A-Z_\d]{2,26}$/i.test(targetUser)) {
			return {
				text: 'malformed username parameter',
				reply: true,
			};
		}

		try {
			const { body: getModsNVips } = await got.get(`https://api.ivr.fi/v2/twitch/modvip/${targetUser}?skipCache=false`, {
				throwHttpErrors: false,
				responseType: 'json',
				headers: {
					'User-Agent':
						'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
				},
			});

			const userID = await IDByLogin(targetUser);
			const { data } = await GetChannelRoles(userID);
			const { artists } = data;
			const artistsMapped = artists.edges.map(({ node, grantedAt }) => ({
				id: node.id,
				login: node.login,
				displayName: node.displayName,
				grantedAt: grantedAt,
			}));

			const modsMapped = getModsNVips.mods.map((x) => x.login + ' (' + x.grantedAt.split('T')[0] + ')' + ' - ' + '[MOD]');
			const vipsMapped = getModsNVips.vips.map((x) => x.login + ' (' + x.grantedAt.split('T')[0] + ')' + ' - ' + '[VIP]');
			const artistMapped = artistsMapped.map((x) => x.login + ' (' + x.grantedAt.split('T')[0] + ')' + ' - ' + '[ARTIST]');
			const modsNvipsMapped = modsMapped.concat(vipsMapped, artistMapped);
			const { key } = await got
				.post(`https://paste.ivr.fi/documents`, {
					responseType: 'json',
					body: modsNvipsMapped.join('\n'),
				})
				.json();

			return {
				text: `https://paste.ivr.fi/${key} - [${modsMapped.length} mods, ${vipsMapped.length} vips, ${artistMapped.length} artists]`,
				reply: true,
			};
		} catch (e) {
			console.log(e);
			return {
				text: 'error',
				reply: true,
			};
		}
	},
};
