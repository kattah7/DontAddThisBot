"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
const makeErrorCause = require("make-error-cause");
class BaseError extends makeErrorCause.BaseError {
    constructor(message, cause) {
        let newMessage;
        if (message != null &&
            cause != null &&
            cause.message != null &&
            cause.message.length > 0) {
            newMessage = `${message}: ${cause.message}`;
        }
        else if (message != null) {
            newMessage = message;
        }
        else if (cause != null && cause.message != null) {
            newMessage = cause.message;
        }
        else {
            newMessage = "";
        }
        super(newMessage, cause);
    }
}
exports.BaseError = BaseError;
//# sourceMappingURL=base-error.js.map