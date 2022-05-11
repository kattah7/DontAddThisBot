import { ChatClient } from "../client/client";
import { ClientMixin } from "./base-mixin";
export declare const invisibleSuffix = " \uDB40\uDC00";
export declare class AlternateMessageModifier implements ClientMixin {
    private readonly client;
    private readonly lastMessages;
    constructor(client: ChatClient);
    appendInvisibleCharacter(channelName: string, messageText: string, action: boolean): string;
    applyToClient(client: ChatClient): void;
    private onPrivmsgMessage;
}
//# sourceMappingURL=alternate-message-modifier.d.ts.map