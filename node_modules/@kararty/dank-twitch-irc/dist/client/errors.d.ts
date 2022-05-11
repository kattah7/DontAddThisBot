import { BaseError } from "../utils/base-error";
/**
 * Indicates an error directly caused by some bad server message being received,
 * e.g. a msg_channel_suspended when trying to join a channel.
 */
export declare class MessageError extends BaseError {
}
/**
 * Marks an error that mandates a disconnect of a single connection,
 * but must not necessarily mean that a multi-connection client as a whole must disconnect
 */
export declare class ConnectionError extends BaseError {
}
/**
 * Marks an error that mandates a disconnect of a single connection
 * that was caused by a bad message (protocol error) being received from the server,
 * e.g. an unparseable IRC message or an invalid response to some action.
 */
export declare class ProtocolError extends ConnectionError {
}
/**
 * Marks an error that mandates a disconnect of the whole client and all its connections,
 * e.g. a login error.
 */
export declare class ClientError extends ConnectionError {
}
//# sourceMappingURL=errors.d.ts.map