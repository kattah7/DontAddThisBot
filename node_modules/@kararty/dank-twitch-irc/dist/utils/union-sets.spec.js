"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const union_sets_1 = require("./union-sets");
describe("./utils/union-sets", function () {
    describe("#unionSets()", function () {
        it("should clone the set if 1 set is given", function () {
            const original = new Set(["a", "c", "b"]);
            const result = (0, union_sets_1.unionSets)([original]);
            chai_1.assert.sameMembers([...original], [...result]);
            // check if cloned, not same
            original.add("d");
            chai_1.assert.strictEqual(original.size, 4);
            chai_1.assert.strictEqual(result.size, 3);
        });
        it("should union 2 sets", function () {
            const originals = [
                new Set(["a", "b", "c"]),
                new Set(["c", "d", "e", "f"]),
            ];
            const result = (0, union_sets_1.unionSets)(originals);
            chai_1.assert.sameMembers(["a", "b", "c", "d", "e", "f"], [...result]);
        });
        it("should union 3 sets", function () {
            const originals = [
                new Set(["a", "b", "c"]),
                new Set(["c", "d", "e", "f"]),
                new Set(["a", "z"]),
            ];
            const result = (0, union_sets_1.unionSets)(originals);
            chai_1.assert.sameMembers(["a", "b", "c", "d", "e", "f", "z"], [...result]);
        });
    });
});
//# sourceMappingURL=union-sets.spec.js.map