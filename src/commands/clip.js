const { GetClips } = require('../token/helix');
const { ParseUser, IDByLogin } = require('../util/twitch/utils');

module.exports = {
	tags: 'stats',
	name: 'topclip',
	aliases: ['clip'],
	cooldown: 3000,
	description: 'Gets the top clip of the channel',
	execute: async (message, args, client) => {
		const targetChannel = await ParseUser(args[0] ?? message.channelName);
		const uid = await IDByLogin(targetChannel);
		if (uid === null) {
			return {
				text: `Unknown channel`,
			};
		}
		const getClip = (await GetClips(uid))[0];
		if (!getClip) {
			return {
				text: `No clips found for ${targetChannel}`,
			};
		}

		const { url, broadcaster_name, view_count, creator_name, created_at } = getClip;
		return {
			text: `${broadcaster_name}'s all time top clip with ${view_count} views by ${creator_name} at ${created_at.split('T')[0]} ${url}`,
		};
	},
};
