import { ChannelIRCMessage } from "../irc/channel-irc-message";
import { IRCMessageData } from "../irc/irc-message";
export declare class ClearchatMessage extends ChannelIRCMessage {
    /**
     * The target username, undefined if this <code>CLEARCHAT</code> message clears
     * the entire chat.
     */
    readonly targetUsername: string | undefined;
    /**
     * length in seconds (integer), undefined if permanent ban
     */
    readonly banDuration: number | undefined;
    constructor(message: IRCMessageData);
    wasChatCleared(): this is ClearChatClearchatMessage;
    isTimeout(): this is TimeoutClearchatMessage;
    isPermaban(): this is PermabanClearchatMessage;
}
export interface ClearChatClearchatMessage extends ClearchatMessage {
    targetUsername: undefined;
    banDuration: undefined;
}
export interface TimeoutClearchatMessage extends ClearchatMessage {
    targetUsername: string;
    banDuration: number;
}
export interface PermabanClearchatMessage extends ClearchatMessage {
    targetUsername: string;
    banDuration: undefined;
}
//# sourceMappingURL=clearchat.d.ts.map