"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helpers_spec_1 = require("../../helpers.spec");
const common_1 = require("./common");
const parse_error_1 = require("./parse-error");
describe("./message/parser/common", function () {
    describe("#parseIntThrowing()", function () {
        it("should fail on undefined", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, common_1.parseIntThrowing)(undefined), parse_error_1.ParseError, "String source for integer is null/undefined");
        });
        it("should fail on null", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, common_1.parseIntThrowing)(null), parse_error_1.ParseError, "String source for integer is null/undefined");
        });
        it("should fail on non-number string input", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, common_1.parseIntThrowing)("xd"), parse_error_1.ParseError, 'Invalid integer for string "xd"');
        });
        it("should parse integers normally", function () {
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("0"), 0);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("1"), 1);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("1.0"), 1);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("1.000"), 1);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("01.00"), 1);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("01"), 1);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("1.1"), 1);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("1.5"), 1);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("1.9999999999"), 1);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("9007199254740991"), Number.MAX_SAFE_INTEGER);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("-1"), -1);
            chai_1.assert.strictEqual((0, common_1.parseIntThrowing)("-9007199254740991"), Number.MIN_SAFE_INTEGER);
        });
    });
});
//# sourceMappingURL=common.spec.js.map