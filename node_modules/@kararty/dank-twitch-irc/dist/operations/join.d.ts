import { SingleConnection } from "../client/connection";
import { MessageError } from "../client/errors";
import { JoinMessage } from "../message/twitch-types/membership/join";
export declare class JoinError extends MessageError {
    readonly failedChannelName: string;
    constructor(failedChannelName: string, message?: string, cause?: Error);
}
export declare function awaitJoinResponse(conn: SingleConnection, channelName: string): Promise<JoinMessage>;
export declare function joinNothingToDo(conn: SingleConnection, channelName: string): boolean;
export declare function joinChannel(conn: SingleConnection, channelName: string): Promise<JoinMessage | undefined>;
//# sourceMappingURL=join.d.ts.map