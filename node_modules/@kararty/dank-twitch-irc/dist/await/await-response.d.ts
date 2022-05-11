import { SingleConnection } from "../client/connection";
import { IRCMessage } from "../message/irc/irc-message";
export declare type Condition = (message: IRCMessage) => boolean;
export declare const alwaysFalse: Condition;
export declare const alwaysTrue: Condition;
export interface AwaitConfig {
    /**
     * If this condition evaluates to true on any incoming message, the promise is resolved with the message
     * that matched.
     */
    success?: Condition;
    /**
     * If this condition evaluates to true on any incoming message, the promise is rejected with an
     * error specifying the cause message.
     */
    failure?: Condition;
    /**
     * If neither the success or failure condition match on any message within
     * this period (after connection, {@link noResponseAction} is taken.
     */
    timeout?: number;
    /**
     * Action to take after
     *   - a timeout occurs or
     *   - a response awaited later than this response is resolved or rejected
     *     (and given that since the server processes commands
     *     and sends their responses strictly sequentially) this response would
     *     never be fulfilled because the server is done processing this command
     *
     *     E.g. the client issues <code>JOIN #a,#b,#c</code> to the server,
     *     and receives the responses for <code>a</code> and <code>c</code>,
     *     in that order. In that case, the response for <code>b</code> can be
     *     rejected the moment the response for <code>c</code> is received.
     */
    noResponseAction?: "success" | "failure";
    /**
     * Function to create custom error type given optional message and
     * cause error.
     *
     * @param message Optional message
     * @param cause Optional cause
     */
    errorType: (message?: string, cause?: Error) => Error;
    /**
     * Custom error message to pass to the {@link errorType} function
     * as the message, preferably about what kind of response to what
     * input variables was awaited (e.g. channel name)
     */
    errorMessage: string;
}
export declare class ResponseAwaiter {
    readonly promise: Promise<IRCMessage | undefined>;
    private readonly unsubscribers;
    private readonly conn;
    private readonly config;
    private resolvePromise;
    private rejectPromise;
    constructor(conn: SingleConnection, config: AwaitConfig);
    /**
     * Called when this response awaiter is inserted to the head of
     * the queue or moves to the queue head after a previous
     * response awaiter was rejected or resolved.
     */
    movedToQueueHead(): void;
    /**
     * Called by a later awaiter indicating that this awaiter was still
     * in the queue while the later awaiter matched a response.
     */
    outpaced(): void;
    private unsubscribe;
    private resolve;
    private reject;
    private onNoResponse;
    private beginTimeout;
    private joinPendingResponsesQueue;
    private onConnectionClosed;
    onConnectionMessage(msg: IRCMessage): boolean;
    private subscribeTo;
}
export declare function awaitResponse(conn: SingleConnection, config: Omit<AwaitConfig, "noResponseAction"> & {
    noResponseAction: "success";
}): Promise<IRCMessage | undefined>;
export declare function awaitResponse(conn: SingleConnection, config: Omit<AwaitConfig, "noResponseAction"> & {
    noResponseAction?: "failure";
}): Promise<IRCMessage>;
//# sourceMappingURL=await-response.d.ts.map