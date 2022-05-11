"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEmotes = void 0;
const emote_1 = require("../emote");
const common_1 = require("./common");
const parse_error_1 = require("./parse-error");
function parseEmotes(messageText, emotesSrc) {
    const emotes = [];
    if (emotesSrc.length <= 0) {
        return emotes;
    }
    const messageCharacters = [...messageText];
    for (const emoteInstancesSrc of emotesSrc.split("/")) {
        const [emoteID, instancesSrc] = emoteInstancesSrc.split(":", 2);
        for (const instanceSrc of instancesSrc.split(",")) {
            let [startIndex, endIndex] = instanceSrc.split("-").map(common_1.parseIntThrowing);
            if (endIndex == null) {
                throw new parse_error_1.ParseError(`No - found in emote index range "${instanceSrc}"`);
            }
            // to make endIndex exclusive
            endIndex = endIndex + 1;
            // workaround for Twitch bug: https://github.com/twitchdev/issues/issues/104
            if (startIndex < 0) {
                startIndex = 0;
            }
            if (endIndex > messageCharacters.length) {
                endIndex = messageCharacters.length;
            }
            const emoteText = messageCharacters.slice(startIndex, endIndex).join("");
            emotes.push(new emote_1.TwitchEmote(emoteID, startIndex, endIndex, emoteText));
        }
    }
    // sort by start index
    emotes.sort((a, b) => a.startIndex - b.startIndex);
    return emotes;
}
exports.parseEmotes = parseEmotes;
//# sourceMappingURL=emotes.js.map