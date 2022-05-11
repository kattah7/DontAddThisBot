import * as debugLogger from "debug-logger";
import { ResponseAwaiter } from "../await/await-response";
import { ClientConfiguration } from "../config/config";
import { ConnectionMixin } from "../mixins/base-mixin";
import { BaseClient } from "./base-client";
import { Transport } from "./transport/transport";
export declare class SingleConnection extends BaseClient {
    readonly connectionID: number;
    readonly wantedChannels: Set<string>;
    readonly joinedChannels: Set<string>;
    readonly pendingResponses: ResponseAwaiter[];
    readonly transport: Transport;
    protected readonly log: debugLogger.Logger;
    constructor(configuration?: ClientConfiguration);
    connect(): void;
    close(): void;
    destroy(error?: Error): void;
    sendRaw(command: string): void;
    onConnect(): void;
    use(mixin: ConnectionMixin): void;
    private handleLine;
}
//# sourceMappingURL=connection.d.ts.map