const utils = require("../util/utils.js");

module.exports = {
    name: "remove",
    description: "Remove 7tv emote from channel",
    cooldown: 3000,
    execute: async(message, args, client) => {
        if (!args[0]) {
            return {
                text: "7tvM Please specify an emote",
            }
        }
        const StvID = await utils.stvNameToID(message.channelName)
        const isNull = await utils.StvChannelEmotes(StvID)
        if (isNull.data == null) {
            return {
                text: `⛔ ${message.channelName} is not a valid channel...`,
            }
        }
        const Editors = await utils.VThreeEditors(StvID)
        const isBotEditor = Editors.find((x) => x.user.id == "629d77a20e60c6d53da64e38") // DontAddThisBot's 7tv id
        if (isBotEditor) {
            const channel = await bot.DB.channels.findOne({ username: message.channelName }).exec();
            const tc = channel.editors.find(badge => badge.id === message.senderUserID);
            const ChannelOwnerEditor = message.senderUsername.toLowerCase() == message.channelName.toLowerCase()
            if (tc || ChannelOwnerEditor) {
                const channelEmotes = await utils.StvChannelEmotes(StvID)
                const findEmote = channelEmotes.data.emoteSet.emotes.find((x) => x.name == args[0])
                if (findEmote) {
                    await utils.RemoveSTVEmote(findEmote.id, StvID)
                    return {
                        text: `7tvM Emote "${args[0]}" has been successfully removed from ${message.channelName}`,
                    }
                } else {
                    return {
                        text: `⛔ I could not find the emote "${args[0]}" in ${message.channelName}...`
                    }
                }
            } else {
                return {
                    text: `⛔ You are not a editor in ${message.channelName}, ask the broadcaster to add you as an editor by typing <|editor add ${message.senderUsername}>`,
                }
            }
        } else {
            return {
                text: `Please grant @DontAddThisBot as a editor on 7TV 7tvM`
            }
        };
    }
};