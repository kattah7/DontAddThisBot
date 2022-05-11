import { TwitchBadgesList } from "../badges";
import { Color } from "../color";
import { IRCMessage, IRCMessageData } from "../irc/irc-message";
import { TwitchEmoteSets } from "../parser/emote-sets";
/**
 * Global state of the logged in user.
 */
export interface GlobalUserState {
    badgeInfo: TwitchBadgesList;
    badgeInfoRaw: string;
    badges: TwitchBadgesList;
    badgesRaw: string;
    color: Color | undefined;
    colorRaw: string;
    displayName: string;
    emoteSets: TwitchEmoteSets;
    emoteSetsRaw: string;
    userID: string;
}
export declare class GlobaluserstateMessage extends IRCMessage implements GlobalUserState {
    readonly badgeInfo: TwitchBadgesList;
    readonly badgeInfoRaw: string;
    readonly badges: TwitchBadgesList;
    readonly badgesRaw: string;
    readonly color: Color | undefined;
    readonly colorRaw: string;
    readonly displayName: string;
    readonly emoteSets: TwitchEmoteSets;
    readonly emoteSetsRaw: string;
    readonly userID: string;
    constructor(message: IRCMessageData);
    /**
     * Extracts a plain object only containing the fields defined by the
     * {@link GlobalUserState} interface.
     */
    extractGlobalUserState(): GlobalUserState;
}
//# sourceMappingURL=globaluserstate.d.ts.map