const utils = require("../util/utils.js");

module.exports = {
    name: "yoink",
    description: "yoink emotes from channels",
    cooldown: 5000,
    stv: true,
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

        const StvID = await utils.stvNameToID(params.from);
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
            addEmote(findThatEmote.id, StvID2);
        }
        
        async function addEmote (emoteID, setID) {
            addThatEmote = await utils.AddSTVEmote(emoteID, setID);
        }

        const StvID2 = await utils.stvNameToID(message.channelName);
        const channelEmotes = await utils.EmoteSets(StvID);
        const findMainChannel = channelEmotes.find((x) => x.id == StvID);

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
                const addEmote = await utils.AddSTVEmote(findThatEmote.id, StvID2);
                if (addEmote.errors) {
                    return {
                        text: `⛔ ${addEmote.errors[0].extensions.message}`,
                    };
                }

                return {
                    text: `7tvM Yoinked "${args[0]}" to ${message.channelName} from ${params.from}`,
                };
            }
        }


    }
};