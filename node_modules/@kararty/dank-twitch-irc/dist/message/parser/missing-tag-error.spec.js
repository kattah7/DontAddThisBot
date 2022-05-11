"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const missing_tag_error_1 = require("./missing-tag-error");
describe("./message/parser/missing-tag-error", function () {
    describe("MissingTagError", function () {
        it("should have a special formatted message on undefined", function () {
            const e = new missing_tag_error_1.MissingTagError("exampleKey", undefined);
            chai_1.assert.strictEqual(e.message, 'Required tag value not present at key "exampleKey" (is undefined)');
        });
        it("should have a special formatted message on null", function () {
            const e = new missing_tag_error_1.MissingTagError("exampleKey", null);
            chai_1.assert.strictEqual(e.message, 'Required tag value not present at key "exampleKey" (is null)');
        });
        it("should have a special formatted message on empty string", function () {
            const e = new missing_tag_error_1.MissingTagError("exampleKey", "");
            chai_1.assert.strictEqual(e.message, 'Required tag value not present at key "exampleKey" (is empty string)');
        });
        it("should have a formatted message on other string values", function () {
            const e = new missing_tag_error_1.MissingTagError("exampleKey", "test");
            chai_1.assert.strictEqual(e.message, 'Required tag value not present at key "exampleKey" (is "test")');
        });
        it("should store the given values as instance properties", function () {
            const e = new missing_tag_error_1.MissingTagError("exampleKey", "testValue");
            chai_1.assert.strictEqual(e.tagKey, "exampleKey");
            chai_1.assert.strictEqual(e.actualValue, "testValue");
        });
    });
});
//# sourceMappingURL=missing-tag-error.spec.js.map