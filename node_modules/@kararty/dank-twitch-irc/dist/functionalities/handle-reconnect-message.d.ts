import { SingleConnection } from "../client/connection";
import { ConnectionError } from "../client/errors";
export declare class ReconnectError extends ConnectionError {
    constructor(message: string, cause?: Error);
}
export declare function handleReconnectMessage(conn: SingleConnection): void;
//# sourceMappingURL=handle-reconnect-message.d.ts.map