import { ChatClient } from "../client/client";
import { ClientMixin } from "../mixins/base-mixin";
export interface ConnectionPoolOptions {
    poolSize: number;
}
export declare class ConnectionPool implements ClientMixin {
    private client;
    private poolSize;
    constructor(client: ChatClient, options: ConnectionPoolOptions);
    applyToClient(client: ChatClient): void;
    ensureEnoughConnections(): void;
}
//# sourceMappingURL=connection-pool.d.ts.map