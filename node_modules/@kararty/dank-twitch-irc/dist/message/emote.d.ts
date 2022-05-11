/**
 * Single instance of a twitch emote in a message string.
 */
export declare class TwitchEmote {
    /**
     * Numeric ID identifying the emote.
     */
    id: string;
    /**
     * inclusive start index in the original message text.
     * Note that we count unicode code points, not bytes with this.
     * If you use this, make sure your code splits or indexes strings by their
     * unicode code points, and not their bytes.
     */
    startIndex: number;
    /**
     * exclusive end index in the original message text.
     * Note that we count unicode code points, not bytes with this.
     * If you use this, make sure your code splits or indexes strings by their
     * unicode code points, and not their bytes.
     */
    endIndex: number;
    /**
     * The part of the original message string that was recognizes as an emote, e.g. "Kappa".
     */
    code: string;
    constructor(id: string, startIndex: number, endIndex: number, text: string);
}
//# sourceMappingURL=emote.d.ts.map