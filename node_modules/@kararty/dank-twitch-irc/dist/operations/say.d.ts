import { SingleConnection } from "../client/connection";
import { MessageError } from "../client/errors";
import { UserstateMessage } from "../message/twitch-types/userstate";
export declare function removeCommands(message: string): string;
export declare class SayError extends MessageError {
    failedChannelName: string;
    messageText: string;
    action: boolean;
    constructor(failedChannelName: string, failedMessage: string, action: boolean, message?: string, cause?: Error);
}
export declare function say(conn: SingleConnection, channelName: string, messageText: string, replyTo?: string, action?: boolean): Promise<UserstateMessage>;
export declare function me(conn: SingleConnection, channelName: string, message: string): Promise<UserstateMessage>;
//# sourceMappingURL=say.d.ts.map