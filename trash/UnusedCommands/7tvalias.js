const utils = require('../util/utils.js');

module.exports = {
	name: '7tvalias',
	aliases: ['alias', 'rename'],
	description: 'Alias a 7tv emote',
	cooldown: 3000,
	execute: async (message, args, client) => {
		if (!args[0]) {
			return {
				text: '7tvM Usage: |alias <emote> <name>',
			};
		}
		if (!args[1]) {
			return {
				text: '7tvM Usage: |alias <emote> <name>',
			};
		}
		if (!/^[a-z0-9_]+$/i.test(args[1])) {
			return {
				text: `⛔ ${args[1]} is not a valid alias...`,
			};
		}
		const StvID = await utils.stvNameToID(message.channelName);
		const isNull = await utils.StvChannelEmotes(StvID);
		if (isNull.data == null) {
			return {
				text: `⛔ ${message.channelName} is not a valid channel...`,
			};
		}
		const Editors = await utils.VThreeEditors(StvID);
		const isBotEditor = Editors.find((x) => x.user.id == '629d77a20e60c6d53da64e38'); // DontAddThisBot's 7tv id
		if (isBotEditor) {
			const channel = await bot.DB.channels.findOne({ username: message.channelName }).exec();
			const tc = channel.editors.find((badge) => badge.id === message.senderUserID);
			const ChannelOwnerEditor = message.senderUsername.toLowerCase() == message.channelName.toLowerCase();
			if (tc || ChannelOwnerEditor) {
				const channelEmotes = await utils.StvChannelEmotes(StvID);
				const findEmote = channelEmotes.data.emoteSet.emotes.find((x) => x.name == args[0]);
				if (findEmote) {
					const emoteConflict = channelEmotes.data.emoteSet.emotes.find((x) => x.name == args[1]);
					if (emoteConflict) {
						return {
							text: `⛔ Emote "${args[1]}" already exists, therefore it cannot be aliased to "${args[1]}"...`,
						};
					} else {
						const doesSignInRequire = await utils.AliasSTVEmote(findEmote.id, StvID, args[1]);
						if (doesSignInRequire.data.emoteSet == null) {
							switch (doesSignInRequire.errors[0].message) {
								case '70401 Sign-In Required': {
									return {
										text: `⛔ ${doesSignInRequire.errors[0].message}`,
									};
								}
							}
						}
						return {
							text: `7tvM Emote "${args[0]}" has been successfully aliased to "${args[1]}"`,
						};
					}
				} else {
					return {
						text: `⛔ I could not find the emote "${args[0]}" in ${message.channelName}...`,
					};
				}
			} else {
				return {
					text: `⛔ You are not a editor in ${message.channelName}, ask the broadcaster to add you as an editor by typing <|editor add ${message.senderUsername}>`,
				};
			}
		} else {
			return {
				text: `Please grant @DontAddThisBot as a editor on 7TV 7tvM`,
			};
		}
	},
};
