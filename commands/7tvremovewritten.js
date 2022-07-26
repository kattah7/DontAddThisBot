const utils = require('../util/utils.js');

module.exports = {
    name: 'remove',
    cooldown: 5000,
    aliases: ['7tvremove'],
    description: '|remove <main/emote set name> <emote>',
    execute: async(message, args, client) => {
        if (!args[0]) {
            return {
                text: `Specify a emote set. Usage: |remove <main/emote set name> <emote>`
            }
        }
        if (!args[1]) {
            return {
                text: `Specify an emote. Usage: |remove <main/emote set name> <emote>`
            }
        }
        const channelID = await utils.stvNameToID(message.channelName);
        const channelEditors = await utils.VThreeEditors(channelID);
        const isBotEditorInChannelEditors = channelEditors.find(editor => editor.user.id === '629d77a20e60c6d53da64e38'); // DontAddThisBot's 7tv ID
        if (isBotEditorInChannelEditors) {
            const channel = await bot.DB.channels.findOne({ username: message.channelName }).exec();
            const isSenderIDEditor = channel.editors.find((badge) => badge.id === message.senderUserID);
            const ChannelOwnerEditor = message.senderUsername.toLowerCase() == message.channelName.toLowerCase();
            if (isSenderIDEditor||ChannelOwnerEditor) {
                if (args[0] == 'main') {
                    const isNull = await utils.StvChannelEmotes(channelID);
                    const isThatEmoteInChat = isNull.data.emoteSet.emotes.find(emote => emote.name === args[1]);
                        if (isThatEmoteInChat) {
                            await utils.RemoveSTVEmote(isThatEmoteInChat.id, channelID);
                            return {
                                text: `7tvM Successfully removed "${args[1]}" from ${args[0]}`
                            }
                        } else {
                            return {
                                text: `⛔ "${args[1]}" does not contain in ${args[0]}`
                            }
                        }
                } else {
                    const channelEmotes = await utils.V3ChannelEmotes(channelID);
                    const isChannelEmotesFullInSet = channelEmotes.emote_sets.find(emote => emote.name === args[0]);
                    //console.log(isChannelEmotesFullInSet)
                    if (isChannelEmotesFullInSet) {
                        const isThatEmoteInChat = isChannelEmotesFullInSet.emotes.find(emote => emote.name === args[1]);
                        if (isThatEmoteInChat) {
                            //console.log(isThatEmoteInChat.id, isChannelEmotesFullInSet)
                            await utils.RemoveSTVEmote(isThatEmoteInChat.id, isChannelEmotesFullInSet.id)
                            return {
                                text: `7tvM Successfully removed "${args[1]}" from ${args[0]}`
                            }
                        } else {
                            return {
                                text: `⛔ "${args[1]}" does not contain in ${args[0]}`
                            }
                        }
                    } else {
                        return {
                            text: `⛔ "${args[0]}" is not a valid emote set.`
                        }
                    }
                }
            } else {
                return {
                    text: `⛔ You are not a editor in ${message.channelName}, ask the broadcaster to add you as an editor by typing <|editor add ${message.senderUsername}>`
                }
            }
        } else {
            return {
                text: `Please grant @DontAddThisBot as a editor on 7TV 7tvM`
            }
        }
    }
}