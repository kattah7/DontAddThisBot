import { IRCMessage, IRCMessageData } from "../irc/irc-message";
export declare class CapMessage extends IRCMessage {
    readonly subCommand: string;
    readonly capabilities: string[];
    constructor(message: IRCMessageData);
}
//# sourceMappingURL=cap.d.ts.map