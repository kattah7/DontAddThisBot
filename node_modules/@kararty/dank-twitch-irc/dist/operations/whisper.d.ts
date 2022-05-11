import { SingleConnection } from "../client/connection";
import { MessageError } from "../client/errors";
export declare class WhisperError extends MessageError {
    targetUsername: string;
    failedMessage: string;
    constructor(targetUsername: string, failedMessage: string, message?: string, cause?: Error);
}
export declare function whisper(conn: SingleConnection, username: string, message: string): Promise<void>;
//# sourceMappingURL=whisper.d.ts.map