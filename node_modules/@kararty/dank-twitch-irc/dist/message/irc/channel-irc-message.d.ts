import { IRCMessage, IRCMessageData } from "./irc-message";
export declare function getIRCChannelName(message: Pick<IRCMessage, "ircParameters">, optional?: false): string;
export declare function getIRCChannelName(message: Pick<IRCMessage, "ircParameters">, optional: true): string | undefined;
export declare class ChannelIRCMessage extends IRCMessage {
    readonly channelName: string;
    constructor(message: IRCMessageData);
}
//# sourceMappingURL=channel-irc-message.d.ts.map