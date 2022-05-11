"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyCauseInstanceof = exports.causeOf = void 0;
const make_error_cause_1 = require("make-error-cause");
function causeOf(error) {
    if (error instanceof make_error_cause_1.BaseError) {
        return error.cause;
    }
    return undefined;
}
exports.causeOf = causeOf;
function anyCauseInstanceof(error, constructor) {
    let currentError = error;
    while (currentError != null) {
        if (currentError instanceof constructor) {
            return true;
        }
        currentError = causeOf(currentError);
    }
    return false;
}
exports.anyCauseInstanceof = anyCauseInstanceof;
//# sourceMappingURL=any-cause-instanceof.js.map