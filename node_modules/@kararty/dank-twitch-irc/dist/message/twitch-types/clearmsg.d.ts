import { ChannelIRCMessage } from "../irc/channel-irc-message";
import { IRCMessageData } from "../irc/irc-message";
export declare class ClearmsgMessage extends ChannelIRCMessage {
    readonly targetUsername: string;
    readonly targetMessageID: string;
    readonly targetMessageContent: string;
    constructor(message: IRCMessageData);
}
//# sourceMappingURL=clearmsg.d.ts.map