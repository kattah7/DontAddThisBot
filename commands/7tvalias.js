
const utils = require("../util/utils.js")

module.exports = {
    name: "7tvalias",
    aliases: ["alias"],
    description: "Alias a 7tv emote",
    cooldown: 1000,
    execute: async(message, args, client) => {
        if (!args[0]) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me Usage: |alias <emote> <name>`)
            } else {
                return {
                    text: "Usage: |alias <emote> <name>",
                }
            }
        }
        if (!args[1]) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me Usage: |alias <emote> <name>`)
            } else {
                return {
                    text: "Usage: |alias <emote> <name>",
                }
            }
        }
        const StvID = await utils.stvNameToID(message.channelName)
        const StvID2 = await utils.stvNameToID(message.senderUsername)
        const Editors = (await utils.StvEditors(StvID)).data.user.editor_ids
        const isBotEditor = Editors.find((x) => x == "629d77a20e60c6d53da64e38") // DontAddThisBot's 7tv id
        if (isBotEditor) {
            const isSenderUserEditor = Editors.find((x) => x == StvID2)
            const ChannelOwnerEditor = message.senderUsername.toLowerCase() == message.channelName.toLowerCase()
            if (isSenderUserEditor || ChannelOwnerEditor) {
                const channelEmotes = await utils.StvChannelEmotes(StvID)
                const findEmote = channelEmotes.data.emoteSet.emotes.find((x) => x.name == args[0])
                if (findEmote) {
                    const emoteConflict = channelEmotes.data.emoteSet.emotes.find((x) => x.name == args[1])
                    if (emoteConflict) {
                        if (message.senderUsername == await utils.PoroNumberOne()) {
                            return client.privmsg(message.channelName, `.me Emote "${args[1]}" already exists, therefore it cannot be aliased to "${args[1]}"`)
                        } else {
                            return {
                                text: `Emote "${args[1]}" already exists, therefore it cannot be aliased to "${args[1]}"`,
                            }
                        }
                    } else {
                        await utils.AliasSTVEmote(findEmote.id, StvID, args[1])
                        //console.log(await utils.AliasSTVEmote(findEmote.id, StvID, args[1]))
                        if (message.senderUsername == await utils.PoroNumberOne()) {
                            return client.privmsg(message.channelName, `.me Emote "${args[0]}" has been successfully aliased to "${args[1]}"`)
                        } else {
                            return {
                                text: `Emote "${args[0]}" has been successfully aliased to "${args[1]}"`,
                            }
                        }
                    }
                } else {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        return client.privmsg(message.channelName, `.me I could not find the emote "${args[0]}" in ${message.channelName}`)
                    } else {
                        return {
                            text: `I could not find the emote "${args[0]}" in ${message.channelName}`
                        }
                    }
                }
            } else {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    return client.privmsg(message.channelName, `.me You are not a 7tv editor`)
                } else {
                    return {
                        text: `You are not a 7tv editor`,
                    }
                }
            }
        } else {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me Please grant @DontAddThisBot as a editor :)`)
            } else {
                return {
                    text: `Please grant @DontAddThisBot as a editor :)`
                }
            }
        }
    }
}