import { IRCMessagePrefix } from "./prefix";
import { IRCMessageTags } from "./tags";
export interface IRCMessageData {
    readonly rawSource: string;
    readonly ircPrefixRaw: string | undefined;
    readonly ircPrefix: IRCMessagePrefix | undefined;
    /**
     * The parser ensures this is always uppercase
     */
    readonly ircCommand: string;
    readonly ircParameters: string[];
    readonly ircTags: IRCMessageTags;
}
export declare class IRCMessage implements IRCMessageData {
    readonly rawSource: string;
    readonly ircPrefixRaw: string | undefined;
    readonly ircPrefix: IRCMessagePrefix | undefined;
    /**
     * The parser ensures this is always uppercase
     */
    readonly ircCommand: string;
    readonly ircParameters: string[];
    readonly ircTags: IRCMessageTags;
    constructor(messageData: IRCMessageData);
}
export declare function getParameter(message: Pick<IRCMessage, "ircParameters">, idx: number): string;
export declare function requireParameter(message: Pick<IRCMessage, "ircParameters">, idx: number): string;
export declare function requireNickname(message: Pick<IRCMessage, "ircPrefix">): string;
//# sourceMappingURL=irc-message.d.ts.map