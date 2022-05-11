"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFlags = void 0;
const flag_1 = require("../flag");
function parseFlags(messageText, flagsSrc) {
    const flags = [];
    const regex = /^(,?(?:[0-9]+-[0-9]+:)(?:(?:[ISAP]\.[0-9]+\/?)+)?)+$/g;
    const matchFlagsSrc = flagsSrc.match(regex);
    if (flagsSrc.length <= 0 || matchFlagsSrc === null) {
        return flags;
    }
    const messageCharacters = [...messageText];
    for (const flagInstancesSrc of flagsSrc.split(",")) {
        const [indexes, instancesSrc] = flagInstancesSrc.split(":", 2);
        let [startIndex, endIndex] = indexes.split("-").map((s) => Number(s));
        // to make endIndex exclusive
        endIndex = endIndex + 1;
        // flags tag can have wildly out-of-bounds indexes
        if (startIndex < 0) {
            startIndex = 0;
        }
        if (endIndex > messageCharacters.length) {
            endIndex = messageCharacters.length;
        }
        const flagText = messageCharacters.slice(startIndex, endIndex).join("");
        const categories = [];
        for (const instanceSrc of instancesSrc.split("/")) {
            if (instanceSrc.length > 0) {
                const [category, score] = instanceSrc.split(".");
                categories.push({
                    category,
                    score: Number(score),
                });
            }
        }
        flags.push(new flag_1.TwitchFlag(startIndex, endIndex, flagText, categories));
    }
    // sort by start index
    flags.sort((a, b) => a.startIndex - b.startIndex);
    return flags;
}
exports.parseFlags = parseFlags;
//# sourceMappingURL=flags.js.map