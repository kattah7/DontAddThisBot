"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReconnectMessage = exports.ReconnectError = void 0;
const errors_1 = require("../client/errors");
class ReconnectError extends errors_1.ConnectionError {
    constructor(message, cause) {
        super(message, cause);
    }
}
exports.ReconnectError = ReconnectError;
function handleReconnectMessage(conn) {
    conn.on("RECONNECT", (msg) => {
        process.nextTick(() => {
            conn.emitError(new ReconnectError("RECONNECT command received by server: " + msg.rawSource));
        });
    });
}
exports.handleReconnectMessage = handleReconnectMessage;
//# sourceMappingURL=handle-reconnect-message.js.map