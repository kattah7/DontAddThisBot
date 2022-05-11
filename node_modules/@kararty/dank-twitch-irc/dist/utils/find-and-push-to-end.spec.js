"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const find_and_push_to_end_1 = require("./find-and-push-to-end");
describe("./utils/find-and-push-to-end", function () {
    describe("findAndPushToEnd", () => {
        it("empty array", () => {
            chai_1.assert.isUndefined((0, find_and_push_to_end_1.findAndPushToEnd)([], (e) => e === 1));
        });
        it("no filter match", () => {
            chai_1.assert.isUndefined((0, find_and_push_to_end_1.findAndPushToEnd)([1, 2, 3], (e) => e === 4));
        });
        it("mutated correctly 1", () => {
            const inArr = [1, 2, 3];
            chai_1.assert.strictEqual((0, find_and_push_to_end_1.findAndPushToEnd)(inArr, (e) => e === 1), 1);
            chai_1.assert.deepStrictEqual(inArr, [2, 3, 1]);
        });
        it("mutated correctly 2", () => {
            const inArr = [1, 2, 3];
            chai_1.assert.strictEqual((0, find_and_push_to_end_1.findAndPushToEnd)(inArr, (e) => e === 2), 2);
            chai_1.assert.deepStrictEqual(inArr, [1, 3, 2]);
        });
    });
});
//# sourceMappingURL=find-and-push-to-end.spec.js.map