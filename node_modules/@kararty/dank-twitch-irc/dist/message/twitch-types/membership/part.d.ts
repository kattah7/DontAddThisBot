import { ChannelIRCMessage } from "../../irc/channel-irc-message";
import { IRCMessageData } from "../../irc/irc-message";
export declare class PartMessage extends ChannelIRCMessage {
    readonly partedUsername: string;
    constructor(message: IRCMessageData);
}
//# sourceMappingURL=part.d.ts.map