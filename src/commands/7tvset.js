const { GlobalEmote } = require('../token/stvREST');
const { SwitchEmoteSet } = require('../token/stvGQL');

module.exports = {
	tags: '7tv',
	name: '7tvset',
	aliases: ['set'],
	description: 'Change your 7tv emote set',
	cooldown: 3500,
	stv: true,
	execute: async (client, msg) => {
		const Emote = GlobalEmote();
		const { connections, emote_sets } = msg.sevenTV.user;
		const CurrentConnection = connections.find((x) => x.id === msg.channel.id);
		if (!CurrentConnection || emote_sets.length === 0) {
			return {
				text: `⛔ Not connected to this channel`,
				reply: true,
			};
		}

		const FindSet = emote_sets.find((x) => x.id === CurrentConnection.emote_set_id);
		if (!FindSet) {
			return {
				text: `⛔ No sets equipped`,
				reply: true,
			};
		}

		const { name, capacity, emotes } = FindSet;
		if (!msg.args[0]) {
			return {
				text: `${Emote} - Currently on "${name}" with (${emotes.length}/${capacity}) Slots`,
				reply: false,
			};
		}

		const InputSet = msg.args.join(' ');
		const findSpecificSet = emote_sets.find((x) => x.name === InputSet);
		if (!findSpecificSet) {
			return {
				text: `⛔ "${InputSet}" Not found`,
				reply: true,
			};
		}

		const { errors } = await SwitchEmoteSet(msg.channel.id, findSpecificSet.id, msg.sevenTV.user.id);
		if (errors) {
			return {
				text: `⛔ ${errors[0]?.extensions?.message}`,
				reply: true,
			};
		}

		if (msg.args.length > 0) {
			return {
				text: `${Emote} - Switched to "${findSpecificSet.name}" with (${findSpecificSet.emotes.length}/${findSpecificSet.capacity}) Slots`,
				reply: false,
			};
		}
	},
};
