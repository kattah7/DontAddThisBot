"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingTagError = void 0;
const reason_for_value_1 = require("../../utils/reason-for-value");
const missing_data_error_1 = require("./missing-data-error");
class MissingTagError extends missing_data_error_1.MissingDataError {
    tagKey;
    actualValue;
    constructor(tagKey, actualValue, cause) {
        super(`Required tag value not present at key "${tagKey}" (is ${(0, reason_for_value_1.reasonForValue)(actualValue)})`, cause);
        this.tagKey = tagKey;
        this.actualValue = actualValue;
    }
}
exports.MissingTagError = MissingTagError;
//# sourceMappingURL=missing-tag-error.js.map