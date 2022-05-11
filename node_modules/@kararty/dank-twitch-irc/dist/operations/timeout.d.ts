import { SingleConnection } from "../client/connection";
import { MessageError } from "../client/errors";
export declare class UserTimeoutError extends MessageError {
    channelName: string;
    username: string;
    length: number;
    reason: string | undefined;
    constructor(channelName: string, username: string, length: number, reason: string | undefined, message?: string, cause?: Error);
}
export declare function timeout(conn: SingleConnection, channelName: string, username: string, length: number, reason?: string): Promise<void>;
//# sourceMappingURL=timeout.d.ts.map