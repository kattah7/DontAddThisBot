"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const remove_in_place_1 = require("./remove-in-place");
describe("./utils/remove-in-place", function () {
    describe("#removeInPlace()", function () {
        it("empty array", () => {
            const arr = [];
            (0, remove_in_place_1.removeInPlace)(arr, 1);
            chai_1.assert.deepStrictEqual(arr, []);
        });
        it("correct on one", () => {
            const arr = [1, 2, 3];
            (0, remove_in_place_1.removeInPlace)(arr, 2);
            chai_1.assert.deepStrictEqual(arr, [1, 3]);
        });
        it("correct on multiple", () => {
            const arr = [1, 2, 3, 2];
            (0, remove_in_place_1.removeInPlace)(arr, 2);
            chai_1.assert.deepStrictEqual(arr, [1, 3]);
        });
        it("at the start", () => {
            const arr = [1, 2, 3];
            (0, remove_in_place_1.removeInPlace)(arr, 1);
            chai_1.assert.deepStrictEqual(arr, [2, 3]);
        });
        it("at the end", () => {
            const arr = [1, 2, 3];
            (0, remove_in_place_1.removeInPlace)(arr, 2);
            chai_1.assert.deepStrictEqual(arr, [1, 3]);
        });
    });
});
//# sourceMappingURL=remove-in-place.spec.js.map