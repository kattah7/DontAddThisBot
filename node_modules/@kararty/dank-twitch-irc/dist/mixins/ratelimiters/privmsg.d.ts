import { ChatClient } from "../../client/client";
import { ClientMixin } from "../base-mixin";
export declare class PrivmsgMessageRateLimiter implements ClientMixin {
    private readonly client;
    private readonly highPrivmsgSemaphore;
    private readonly lowPrivmsgSemaphore;
    constructor(client: ChatClient);
    applyToClient(client: ChatClient): void;
    private acquire;
}
//# sourceMappingURL=privmsg.d.ts.map