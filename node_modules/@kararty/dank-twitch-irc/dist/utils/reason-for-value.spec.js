"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const reason_for_value_1 = require("./reason-for-value");
describe("./utils/reason-for-value", function () {
    describe("#reasonForValue()", function () {
        it('should return "undefined" for undefined', function () {
            chai_1.assert.strictEqual((0, reason_for_value_1.reasonForValue)(undefined), "undefined");
        });
        it('should return "null" for null', function () {
            chai_1.assert.strictEqual((0, reason_for_value_1.reasonForValue)(null), "null");
        });
        it('should return "empty string" for an empty string', function () {
            chai_1.assert.strictEqual((0, reason_for_value_1.reasonForValue)(""), "empty string");
        });
        it('should return ""the string value"" for string values', function () {
            chai_1.assert.strictEqual((0, reason_for_value_1.reasonForValue)("test"), '"test"');
        });
    });
});
//# sourceMappingURL=reason-for-value.spec.js.map