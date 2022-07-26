const utils = require('../util/utils.js');

module.exports = {
    name: 'add',
    description: 'Usage: |add <main/emote set name> <emote> <channel if you want>',
    aliases: ["7tvadd"],
    cooldown: 3000,
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `Specify a emote set. Usage: |add <main/emote set name> <emote>`
            }
        }
        if (!args[1]) {
            return {
                text: `Specify a emote set. Usage: |add <main/emote set name> <emote>`
            }
        }
        const channelID = await utils.stvNameToID(message.channelName);
        const channelEditors = await utils.VThreeEditors(channelID);
        const isBotEditorInChannelEditors = channelEditors.find(editor => editor.user.id === '629d77a20e60c6d53da64e38'); // DontAddThisBot's 7tv ID
        //console.log(channelEditors)
        if (isBotEditorInChannelEditors) {
            const channel = await bot.DB.channels.findOne({ username: message.channelName }).exec();
            const isSenderIDEditor = channel.editors.find((badge) => badge.id === message.senderUserID);
            const ChannelOwnerEditor = message.senderUsername.toLowerCase() == message.channelName.toLowerCase();
            if (isSenderIDEditor || ChannelOwnerEditor) {
                if (args[0] == 'main') {
                    if (args[2]) {
                        const StvID2 = await utils.stvNameToID(args[2]);
                        const isNull = await utils.StvChannelEmotes(StvID2);
                        if (isNull.data == null) {
                            return {
                                text: `⛔ "${args[2]}" is not a valid channel...`
                            }
                        } else {
                            const isEmoteInThatChannel = isNull.data.emoteSet.emotes.find(emote => emote.name === args[1]);
                            if (isEmoteInThatChannel) {
                                const channelEmotes = await utils.StvChannelEmotes(channelID);
                                if (channelEmotes.data.emoteSet.emotes.length == channelEmotes.data.emoteSet.capacity) {
                                    return {
                                        text: `⛔ Main emote slots are full!`
                                    }
                                } else {
                                    const emoteAlreadyExist = channelEmotes.data.emoteSet.emotes.find(emote => emote.name === args[1]);
                                    if (emoteAlreadyExist) {
                                        return {
                                            text: `⛔ Emote already exists!`
                                        }
                                    } else {
                                        await utils.AddSTVEmote(isEmoteInThatChannel.id, channelID);
                                        const KEKG = await utils.IDtoEmote(isEmoteInThatChannel.id);
                                        if (KEKG != args[1]) {
                                            await utils.AliasSTVEmote(isEmoteInThatChannel.id, channelID, args[1]);
                                            return {
                                                text: `7tvM Successfully added "${KEKG}" to main from ${args[2]} & auto-aliased to "${args[1]}"`,
                                            };
                                        }
                                        return {
                                            text: `7tvM Successfully added "${args[1]}" to main from "${args[2]}"`
                                        }
                                    }
                                }
                            } else {
                                return {
                                    text: `⛔ Could not find "${args[1]}" in "${args[2]}"`,
                                };
                            }
                        } 
                    }
                    const channelEmotes = await utils.StvChannelEmotes(channelID);
                    if (channelEmotes.data.emoteSet.emotes.length == channelEmotes.data.emoteSet.capacity) {
                        return {
                            text: `⛔ Main emote slots are full in main!`
                        }
                    } else {
                        const emoteAlreadyExist = channelEmotes.data.emoteSet.emotes.find(emote => emote.name === args[1]);
                        if (emoteAlreadyExist) {
                            return {
                                text: `⛔ Emote already exists in main!`
                            }
                        } else {
                            if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(args[1])) {
                                const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(args[1]);
                                const emoteName = await utils.StvEmoteIDToEmoteName(linkEmote[2]);
                                if (emoteName.data.emote == null) {
                                    return {
                                        text: `⛔ Emote does not exist`,
                                    }
                                }
                                const linkEmoteAlreadyExist = channelEmotes.data.emoteSet.emotes.find(emote => emote.name === emoteName.data.emote.name);
                                if (linkEmoteAlreadyExist) {
                                    return {
                                        text: `⛔ "${emoteName.data.emote.name}" already exists in main!`
                                    }
                                } else {
                                    await utils.AddSTVEmote(linkEmote[2], channelID);
                                    return {
                                        text: `7tvM Successfully added emote "${emoteName.data.emote.name}" to main`
                                    } 
                                }
                            }
                            const searchEmotes = await utils.SearchSTVEmote(args[1]);
                            if (searchEmotes) {
                                if (searchEmotes.data == null) {
                                    return {
                                        text: `⛔ Emote "${args[1]}" not found`,
                                    };
                                }
                                const findThatEmote = searchEmotes.data.emotes.items.find((emote) => emote.name === args[1]);
                                if (findThatEmote) {
                                    await utils.AddSTVEmote(findThatEmote.id, channelID)
                                    return {
                                        text: `7tvM Emote "${args[1]}" added to emote set "${args[0]}"`
                                    }
                                } else {
                                    const notFoundEmote = searchEmotes.data.emotes.items[0].name
                                    const linkEmoteAlreadyExist = channelEmotes.data.emoteSet.emotes.find(emote => emote.name === notFoundEmote);
                                    if (linkEmoteAlreadyExist) {
                                        return {
                                            text: `⛔ "${notFoundEmote}" already exists in main!`
                                        }
                                    } else {
                                        const notFoundEmoteID = searchEmotes.data.emotes.items[0].id
                                        await utils.AddSTVEmote(notFoundEmoteID, channelID)
                                        return {
                                            text: `7tvM Emote "${args[1]}" not found in search results, therefore added "${notFoundEmote}" to main.`,
                                        };
                                    }
                                }
                            }
                        }
                    }

                } else {
                    const emoteSets = await utils.EmoteSets(channelID);
                    const findThatEmoteSet = emoteSets.find(emoteSet => emoteSet.name === args[0]);
                    if (args[2]) {
                        const StvID2 = await utils.stvNameToID(args[2]);
                        const isNull = await utils.StvChannelEmotes(StvID2);
                        //console.log(isNull)
                        if (isNull.data == null) {
                            return {
                                text: `⛔ "${args[2]}" is not a valid channel...`,
                            };
                        } else {
                            const isEmoteInThatChannel = isNull.data.emoteSet.emotes.find(emote => emote.name === args[1]);
                            if (isEmoteInThatChannel) {
                                const channelEmotes = await utils.V3ChannelEmotes(channelID);
                                const isEmoteAlreadyInChannel = channelEmotes.emote_sets.find(emote => emote.name === args[0]);
                                if (isEmoteAlreadyInChannel) {
                                    if (isEmoteAlreadyInChannel.emotes.length == isEmoteAlreadyInChannel.capacity) {
                                        return {
                                            text: `⛔ "${args[0]}" emote slots are already full...`,
                                        };
                                    } else {
                                        const isEmoteAlreadyEnabledInMySet = isEmoteAlreadyInChannel.emotes.find(emote => emote.name === args[1]);
                                        if (isEmoteAlreadyEnabledInMySet) {
                                            return {
                                                text: `⛔ "${args[1]}" is already enabled in "${args[0]}"...`,
                                            };
                                        } else {
                                            await utils.AddSTVEmote(isEmoteInThatChannel.id, isEmoteAlreadyInChannel.id);
                                            const KEKG = await utils.IDtoEmote(isEmoteInThatChannel.id);
                                            if (KEKG != args[1]) {
                                                await utils.AliasSTVEmote(isEmoteInThatChannel.id, isEmoteAlreadyInChannel.id, args[1]);
                                                return {
                                                    text: `7tvM Successfully added "${KEKG}" to ${args[0]} from ${args[2]} & auto-aliased to "${args[1]}"`,
                                                };
                                            }
                                            return {
                                                text: `7tvM Successfully added "${args[1]}" to emote set "${args[0]}" from "${args[2]}"`
                                            }
                                        }
                                    }
                                } else {
                                    return {
                                        text: `⛔ "${args[0]}" Emote set doesn't exist`,
                                    }
                                }
                            } else {
                                return {
                                    text: `⛔ Could not find "${args[1]}" in "${args[2]}"`,
                                };
                            }
                        }
                    }
                    if (findThatEmoteSet) {
                        const channelEmotes = await utils.V3ChannelEmotes(channelID);
                        const isChannelEmotesFullInSet = channelEmotes.emote_sets.find(emote => emote.name === args[0]);
                        const channelCurrentEmotesAmount = isChannelEmotesFullInSet.emotes.length
                        const channelTotalCapacity = isChannelEmotesFullInSet.capacity;
                        if (channelCurrentEmotesAmount == channelTotalCapacity) {
                            return {
                                text: `⛔ "${args[0]}" is already full!`
                            }
                        } else {
                            //console.log(isChannelEmotesFullInSet.emotes)
                            const emoteAlreadyExist = isChannelEmotesFullInSet.emotes.find(emote => emote.name === args[1]);
                            if (emoteAlreadyExist) {
                                return {
                                    text: `⛔ "${args[1]}" already exists in emote set "${args[0]}"!`
                                }
                            } else {
                                if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(args[1])) {
                                    const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(args[1]);
                                    const emoteName = await utils.StvEmoteIDToEmoteName(linkEmote[2]);
                                    if (emoteName.data.emote == null) {
                                        return {
                                            text: `⛔ Emote does not exist`,
                                        }
                                    }
                                    const linkEmoteAlreadyExist = isChannelEmotesFullInSet.emotes.find(emote => emote.name === emoteName.data.emote.name);
                                    if (linkEmoteAlreadyExist) {
                                        return {
                                            text: `⛔ "${emoteName.data.emote.name}" already exists in emote set "${args[0]}"!`
                                        }
                                    } else {
                                        await utils.AddSTVEmote(linkEmote[2], isChannelEmotesFullInSet.id);
                                        return {
                                            text: `7tvM Successfully added emote "${emoteName.data.emote.name}" to emote set "${args[0]}"`
                                        }
                                    }
                                }
                                const searchEmotes = await utils.SearchSTVEmote(args[1]);
                                if (searchEmotes) {
                                    if (searchEmotes.data == null) {
                                        return {
                                            text: `⛔ Emote "${args[1]}" not found`,
                                        };
                                    } 
                                    const findThatEmote = searchEmotes.data.emotes.items.find((emote) => emote.name === args[1]);
                                    //console.log(searchEmotes.data.emotes.items)
                                    if (findThatEmote) {
                                        await utils.AddSTVEmote(findThatEmote.id, findThatEmoteSet.id)
                                        return {
                                            text: `7tvM Emote "${args[1]}" added to emote set "${args[0]}"`
                                        }
                                    } else {
                                        const notFoundEmote = searchEmotes.data.emotes.items[0].name
                                        const linkEmoteAlreadyExist = isChannelEmotesFullInSet.emotes.find(emote => emote.name === notFoundEmote);
                                        if (linkEmoteAlreadyExist) {
                                            return {
                                                text: `⛔ "${notFoundEmote}" already exists in emote set "${args[0]}"!`
                                            }
                                        } else {
                                            const notFoundEmoteID = searchEmotes.data.emotes.items[0].id
                                            await utils.AddSTVEmote(notFoundEmoteID, findThatEmoteSet.id)
                                            return {
                                                text: `7tvM Emote "${args[1]}" not found in search results, therefore added "${notFoundEmote}" to ${args[0]}.`,
                                            };
                                        }
                                    }
                                } 
                            }
                        }
                    } else {
                        return {
                            text: `⛔ Could not find set name "${args[0]}" in ${message.channelName}`
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