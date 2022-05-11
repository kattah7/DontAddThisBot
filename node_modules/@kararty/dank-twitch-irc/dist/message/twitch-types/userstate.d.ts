import { TwitchBadgesList } from "../badges";
import { Color } from "../color";
import { ChannelIRCMessage } from "../irc/channel-irc-message";
import { IRCMessageData } from "../irc/irc-message";
import { TwitchEmoteSets } from "../parser/emote-sets";
/**
 * State of the logged in user in a channel.
 */
export interface UserState {
    badgeInfo: TwitchBadgesList;
    badgeInfoRaw: string;
    badges: TwitchBadgesList;
    badgesRaw: string;
    color: Color | undefined;
    colorRaw: string;
    displayName: string;
    emoteSets: TwitchEmoteSets;
    emoteSetsRaw: string;
    isMod: boolean;
    isModRaw: string;
}
export declare class UserstateMessage extends ChannelIRCMessage implements UserState {
    readonly badgeInfo: TwitchBadgesList;
    readonly badgeInfoRaw: string;
    readonly badges: TwitchBadgesList;
    readonly badgesRaw: string;
    readonly color: Color | undefined;
    readonly colorRaw: string;
    readonly displayName: string;
    readonly emoteSets: TwitchEmoteSets;
    readonly emoteSetsRaw: string;
    readonly isMod: boolean;
    readonly isModRaw: string;
    constructor(message: IRCMessageData);
    extractUserState(): UserState;
}
//# sourceMappingURL=userstate.d.ts.map