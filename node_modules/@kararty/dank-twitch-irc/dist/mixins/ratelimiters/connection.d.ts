import { ChatClient } from "../../client/client";
import { SingleConnection } from "../../client/connection";
import { ClientMixin, ConnectionMixin } from "../base-mixin";
export interface ConnectionRateLimits {
    parallelConnections: number;
    releaseTime: number;
}
export declare class ConnectionRateLimiter implements ClientMixin, ConnectionMixin {
    private readonly client;
    private readonly semaphore;
    constructor(client: ChatClient);
    acquire(): Promise<void>;
    releaseOnConnect(conn: SingleConnection): void;
    applyToClient(client: ChatClient): void;
    applyToConnection(connection: SingleConnection): void;
}
//# sourceMappingURL=connection.d.ts.map