"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const base_error_1 = require("../utils/base-error");
class ValidationError extends base_error_1.BaseError {
    constructor(message) {
        super(message);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=validation-error.js.map