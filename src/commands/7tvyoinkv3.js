const utils = require("../util/utils.js");

module.exports = {
    name: "yoink",
    description: "yoink emotes from channels",
    cooldown: 5000,
    stv: true,
    stvOnly: true,
    execute: async (message, args, client, xd, params) => {
        if (!args[0]) {
            return {
                text: "7tvM Please specify an emote",
            }
        }

        if (!params.from) {
            return {
                text: "7tvM Please specify a channel",
            };
        }

        var regex = (/^from:(.*)$/g);
        if (!args[0] || regex.test(args[0])) {
            const channelData = await bot.DB.channels.findOne({ id: message.channelID }).exec();
            const isArgsRegex = args[0] ? regex.test(args[0]) || args[1] ? `⛔ Usage ${(channelData.prefix) ?? `|`}yoink <emote or more emotes> <from:channel>` : `⛔ Please specify an correct channel` : `⛔ Please specify an emote`;
            return {
                text: `${isArgsRegex}`,
            }
        }

        const UID = await utils.IDByLogin(params.from)
        const StvID = await utils.stvNameToID(UID);
        if (!StvID) {
            return {
                text: `⛔ "${params.from}" is not a valid channel`,
            };
        }

        let find = 0;
        async function findEmote (emoteID) {
            findThatEmote = findMainChannel.emotes.find((x) => x.name == emoteID);
            if (!findThatEmote) { return false; }
            find += 1;
            addEmote(findThatEmote.id, findMainChannel2.id);
        }
        
        async function addEmote (emoteID, setID) {
            addThatEmote = await utils.AddSTVEmote(emoteID, setID);
        }

        const StvID2 = await utils.stvNameToID(message.channelID);
        const channelEmotes2 = await utils.EmoteSets(StvID2);
        const findMainChannel2 = channelEmotes2.find((x) => x.owner.id == StvID2);
        const channelEmotes = await utils.EmoteSets(StvID);
        const findMainChannel = channelEmotes.find((x) => x.owner.id == StvID);

        if (!/from:(.*)$/g.test(args[1])) {
            for (const allArgs of args) {
                findEmote(allArgs.replace(/from:(.*)$/g, ''));
            }

            if (find == 0) {
                return {
                    text: `⛔ ${args.map((x) => x.replace(/from:(.*)$/g, '')).join(', ')} not found in ${params.from}`,
                };
            }
            return {
                text: `7tvM ${find} emote${find == 1 ? '' : 's'} found from ${params.from}, adding emotes to ${message.channelName}. There may be some errors`,
            }
        } else {
            const findThatEmote = findMainChannel.emotes.find((x) => x.name == args[0]);
            if (!findThatEmote) {
                return {
                    text: `⛔ "${args[0]}" not found in ${params.from}`,
                };
            } else {
                const addEmote = await utils.AddSTVEmote(findThatEmote.id, findMainChannel2.id);
                if (addEmote.errors) {
                    return {
                        text: `⛔ ${addEmote.errors[0].extensions.message}`,
                    };
                }
                const EmoteIdToName = await utils.IDtoEmote(findThatEmote.id);
                if (EmoteIdToName != findThatEmote.name) {
                    const alias = await utils.AliasSTVEmote(findThatEmote.id, findMainChannel2.id, findThatEmote.name);
                    if (alias.errors) {
                        return {
                            text: `7tvM Yoinked "${EmoteIdToName}" to ${message.channelName} but error auto-aliasing, ⛔ ${alias.errors[0].extensions.message}`,
                        };
                    };
                    
                    return {
                        text: `7tvM Yoinked "${EmoteIdToName}" to ${message.channelName} & auto-aliased to "${findThatEmote.name}"`,
                    }
                }

                return {
                    text: `7tvM Yoinked "${args[0]}" to ${message.channelName} from ${params.from}`,
                };
            }
        }


    }
};