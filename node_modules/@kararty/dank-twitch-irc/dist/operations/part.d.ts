import { SingleConnection } from "../client/connection";
import { MessageError } from "../client/errors";
import { PartMessage } from "../message/twitch-types/membership/part";
export declare class PartError extends MessageError {
    failedChannelName: string;
    constructor(failedChannelName: string, message?: string, cause?: Error | undefined);
}
export declare function awaitPartResponse(conn: SingleConnection, channelName: string): Promise<PartMessage>;
export declare function partNothingToDo(conn: SingleConnection, channelName: string): boolean;
export declare function partChannel(conn: SingleConnection, channelName: string): Promise<PartMessage | undefined>;
//# sourceMappingURL=part.d.ts.map