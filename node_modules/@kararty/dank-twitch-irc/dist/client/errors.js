"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientError = exports.ProtocolError = exports.ConnectionError = exports.MessageError = void 0;
const base_error_1 = require("../utils/base-error");
// tslint:disable:max-classes-per-file
/**
 * Indicates an error directly caused by some bad server message being received,
 * e.g. a msg_channel_suspended when trying to join a channel.
 */
class MessageError extends base_error_1.BaseError {
}
exports.MessageError = MessageError;
/**
 * Marks an error that mandates a disconnect of a single connection,
 * but must not necessarily mean that a multi-connection client as a whole must disconnect
 */
class ConnectionError extends base_error_1.BaseError {
}
exports.ConnectionError = ConnectionError;
/**
 * Marks an error that mandates a disconnect of a single connection
 * that was caused by a bad message (protocol error) being received from the server,
 * e.g. an unparseable IRC message or an invalid response to some action.
 */
class ProtocolError extends ConnectionError {
}
exports.ProtocolError = ProtocolError;
/**
 * Marks an error that mandates a disconnect of the whole client and all its connections,
 * e.g. a login error.
 */
class ClientError extends ConnectionError {
}
exports.ClientError = ClientError;
//# sourceMappingURL=errors.js.map