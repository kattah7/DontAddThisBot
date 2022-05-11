"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = void 0;
const base_error_1 = require("../utils/base-error");
/**
 * Signifies some sort of timeout while waiting for something to complete
 */
class TimeoutError extends base_error_1.BaseError {
    constructor(message) {
        super(message);
    }
}
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=timeout-error.js.map