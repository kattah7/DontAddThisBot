"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const constants_1 = require("./constants");
describe("./constants", function () {
    describe("MAX_OUTGOING_LINE_LENGTH", function () {
        it("should be 4096", function () {
            chai_1.assert.strictEqual(constants_1.MAX_OUTGOING_LINE_LENGTH, 4096);
        });
    });
    describe("MAX_OUTGOING_COMMAND_LENGTH", function () {
        it("should be 4094", function () {
            chai_1.assert.strictEqual(constants_1.MAX_OUTGOING_COMMAND_LENGTH, 4094);
        });
    });
});
//# sourceMappingURL=constants.spec.js.map