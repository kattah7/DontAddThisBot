import { ChannelIRCMessage } from "../../irc/channel-irc-message";
import { IRCMessageData } from "../../irc/irc-message";
export declare class JoinMessage extends ChannelIRCMessage {
    readonly joinedUsername: string;
    constructor(message: IRCMessageData);
}
//# sourceMappingURL=join.d.ts.map