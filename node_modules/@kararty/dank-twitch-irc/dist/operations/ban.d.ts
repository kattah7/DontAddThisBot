import { SingleConnection } from "../client/connection";
import { MessageError } from "../client/errors";
export declare class UserBanError extends MessageError {
    channelName: string;
    username: string;
    reason: string | undefined;
    constructor(channelName: string, username: string, reason: string | undefined, message?: string, cause?: Error);
}
export declare function ban(conn: SingleConnection, channelName: string, username: string, reason?: string): Promise<void>;
//# sourceMappingURL=ban.d.ts.map