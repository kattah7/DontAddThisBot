import { SingleConnection } from "../client/connection";
import { ConnectionError } from "../client/errors";
import { PongMessage } from "../message/twitch-types/connection/pong";
export declare class PingTimeoutError extends ConnectionError {
}
export declare function sendPing(conn: SingleConnection, pingIdentifier?: string, timeout?: number): Promise<PongMessage>;
//# sourceMappingURL=ping.d.ts.map