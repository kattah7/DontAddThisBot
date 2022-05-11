"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reasonForValue = void 0;
function reasonForValue(actualValue) {
    if (actualValue === undefined) {
        return "undefined";
    }
    if (actualValue === null) {
        return "null";
    }
    if (actualValue.length <= 0) {
        return "empty string";
    }
    return `"${actualValue}"`;
}
exports.reasonForValue = reasonForValue;
//# sourceMappingURL=reason-for-value.js.map