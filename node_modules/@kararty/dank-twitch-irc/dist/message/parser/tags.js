"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTags = exports.decodeValue = void 0;
const decodeMap = {
    "\\\\": "\\",
    "\\:": ";",
    "\\s": " ",
    "\\n": "\n",
    "\\r": "\r",
    "\\": "", // remove invalid backslashes
};
const decodeLookupRegex = /\\\\|\\:|\\s|\\n|\\r|\\/g;
// if value is undefined (no = in tagSrc) then value becomes null
function decodeValue(value) {
    if (value == null) {
        return null;
    }
    return value.replace(decodeLookupRegex, (m) => decodeMap[m] || "");
}
exports.decodeValue = decodeValue;
function parseTags(tagsSrc) {
    const tags = {};
    if (tagsSrc == null) {
        return tags;
    }
    for (const tagSrc of tagsSrc.split(";")) {
        let key;
        let valueSrc;
        // eslint is bugged on this in the current version
        // eslint-disable-next-line prefer-const
        [key, valueSrc] = tagSrc.split("=", 2);
        tags[key.toLowerCase()] = decodeValue(valueSrc);
    }
    return tags;
}
exports.parseTags = parseTags;
//# sourceMappingURL=tags.js.map