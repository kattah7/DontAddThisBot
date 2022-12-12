const utils = require('../util/utils.js');

module.exports = {
	name: '7tvyoink',
	aliases: ['yoink'],
	description: 'Yoink a 7tv emote from a channel',
	cooldown: 3000,
	execute: async (message, args, client) => {
		if (message.senderUsername == message.channelName) {
			return {
				text: '⛔ You cannot yoink emotes from your own channel...',
			};
		}
		if (!args[0]) {
			return {
				text: '7tvM Usage: |yoink <emote>',
			};
		}
		const StvID = await utils.stvNameToID(message.channelName);
		const isNull = await utils.StvChannelEmotes(StvID);
		if (isNull.data == null) {
			return {
				text: `⛔ ${message.channelName} is not a valid channel...`,
			};
		}
		const StvID2 = await utils.stvNameToID(message.senderUsername);
		const Editors = await utils.VThreeEditors(StvID2);
		const isBotEditor = Editors.find((x) => x.user.id == '629d77a20e60c6d53da64e38'); // DontAddThisBot's 7tv id
		if (isBotEditor) {
			const channelEmotes = await utils.StvChannelEmotes(StvID);
			const findEmote = channelEmotes.data.emoteSet.emotes.find((x) => x.name == args[0]);
			if (findEmote) {
				const senderChannel = await utils.StvChannelEmotes(StvID2);
				const emoteConflict = senderChannel.data.emoteSet.emotes.find(
					(x) => x.name == args[0],
				);
				if (emoteConflict) {
					return {
						text: `⛔ Emote "${args[0]}" already exists in ${message.senderUsername}, therefore it cannot be yoinked...`,
					};
				} else {
					const xddddd = await utils.StvChannelEmotes(
						StvID2,
					);
					const availableEmotes =
						xddddd.data.emoteSet.emotes
							.length;
					if (
						availableEmotes ==
						xddddd.data.emoteSet.capacity
					) {
						return {
							text: `⛔ ${message.senderUsername}'s emote slots is full`,
						};
					} else {
						const KEKG =
							await utils.IDtoEmote(
								findEmote.id,
							);
						const doesSignInRequire =
							await utils.AddSTVEmote(
								findEmote.id,
								StvID2,
							);
						if (
							doesSignInRequire
								.data
								.emoteSet ==
							null
						) {
							switch (
								doesSignInRequire
									.errors[0]
									.message
							) {
								case '70401 Sign-In Required': {
									return {
										text: `⛔ ${doesSignInRequire.errors[0].message}`,
									};
								}
							}
						}
						if (KEKG != args[0]) {
							await utils.AliasSTVEmote(
								findEmote.id,
								StvID2,
								args[0],
							);
							return {
								text: `7tvM Yoinked ${args[0]} into ${message.senderUsername}'s channel & auto aliased it to ${args[0]}`,
							};
						}
						return {
							text: `7tvM Yoinked ${args[0]} into ${message.senderUsername}'s channel!`,
						};
					}
				}
			} else {
				return {
					text: `⛔ I could not find the emote "${args[0]}" in ${message.channelName}...`,
				};
			}
		} else {
			return {
				text: `Please grant @DontAddThisBot as a editor in @${message.senderUsername} on 7TV 7tvM`,
			};
		}
	},
};
