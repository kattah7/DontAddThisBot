"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchEmote = void 0;
/**
 * Single instance of a twitch emote in a message string.
 */
class TwitchEmote {
    /**
     * Numeric ID identifying the emote.
     */
    id;
    /**
     * inclusive start index in the original message text.
     * Note that we count unicode code points, not bytes with this.
     * If you use this, make sure your code splits or indexes strings by their
     * unicode code points, and not their bytes.
     */
    startIndex;
    /**
     * exclusive end index in the original message text.
     * Note that we count unicode code points, not bytes with this.
     * If you use this, make sure your code splits or indexes strings by their
     * unicode code points, and not their bytes.
     */
    endIndex;
    /**
     * The part of the original message string that was recognizes as an emote, e.g. "Kappa".
     */
    code;
    constructor(id, startIndex, endIndex, text) {
        this.id = id;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.code = text;
    }
}
exports.TwitchEmote = TwitchEmote;
//# sourceMappingURL=emote.js.map