import { TwitchBadgesList } from "../badges";
import { Color } from "../color";
import { TwitchEmoteList } from "../emotes";
import { TwitchFlagList } from "../flags";
import { ChannelIRCMessage } from "../irc/channel-irc-message";
import { IRCMessage } from "../irc/irc-message";
import { UserState } from "./userstate";
export declare function parseActionAndMessage(trailingParameter: string): {
    isAction: boolean;
    message: string;
};
interface CheerPrivmsgMessage extends PrivmsgMessage {
    readonly bits: number;
    readonly bitsRaw: string;
}
/**
 * Omits `emoteSets` and `emoteSetsRaw` from {@link UserState} (because they are not sent
 * for `PRIVMSG` messages)
 */
export declare type PrivmsgUserState = Omit<UserState, "emoteSets" | "emoteSetsRaw">;
export declare class PrivmsgMessage extends ChannelIRCMessage implements PrivmsgUserState {
    readonly messageText: string;
    readonly isAction: boolean;
    readonly senderUsername: string;
    readonly senderUserID: string;
    readonly badgeInfo: TwitchBadgesList;
    readonly badgeInfoRaw: string;
    readonly badges: TwitchBadgesList;
    readonly badgesRaw: string;
    readonly bits: number | undefined;
    readonly bitsRaw: string | undefined;
    readonly color: Color | undefined;
    readonly colorRaw: string;
    readonly displayName: string;
    readonly emotes: TwitchEmoteList;
    readonly emotesRaw: string;
    /**
     * Can be an array of Twitch AutoMod flagged words, for use in moderation and/or filtering purposes.
     *
     * If the `flags` tag is missing or of a unparseable format, this will be `undefined`. This is unlike most other
     * attributes which when missing or malformed will fail the message parsing. However since this attribute is
     * completely undocumented we cannot rely on the `flags` tag being stable, so this soft fallback is used instead.
     * While it will be a major version release if this attribute changes format in dank-twitch-irc, using this is still
     * at your own risk since it may suddenly contain unexpected data or turn `undefined` one day as
     * Twitch changes something. In short: **Use at your own risk** and make sure your
     * implementation can handle the case where this is `undefined`.
     */
    readonly flags: TwitchFlagList | undefined;
    /**
     * Twitch AutoMod raw flags string.
     *
     * If the `flags` tag is missing or of a unparseable format, this will be `undefined`. This is unlike most other
     * attributes which when missing or malformed will fail the message parsing. However since this attribute is
     * completely undocumented we cannot rely on the `flags` tag being stable, so this soft fallback is used instead.
     * In short, ensure your implementation can handle the case where this is `undefined` or is in
     * a format you don't expect.
     */
    readonly flagsRaw: string | undefined;
    readonly messageID: string;
    readonly isMod: boolean;
    readonly isModRaw: string;
    readonly channelID: string;
    readonly serverTimestamp: Date;
    readonly serverTimestampRaw: string;
    constructor(ircMessage: IRCMessage);
    /**
     * Extracts a plain object only containing the fields defined by the
     * {@link PrivmsgUserState} interface.
     */
    extractUserState(): PrivmsgUserState;
    isCheer(): this is CheerPrivmsgMessage;
}
export {};
//# sourceMappingURL=privmsg.d.ts.map