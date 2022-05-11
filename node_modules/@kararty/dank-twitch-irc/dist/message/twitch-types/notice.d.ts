import { IRCMessage, IRCMessageData } from "../irc/irc-message";
export declare class NoticeMessage extends IRCMessage {
    readonly channelName: string | undefined;
    readonly messageText: string;
    readonly messageID: string | undefined;
    constructor(message: IRCMessageData);
}
//# sourceMappingURL=notice.d.ts.map