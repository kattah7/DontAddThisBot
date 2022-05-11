"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const set_defaults_1 = require("./set-defaults");
describe("./utils/set-defaults", function () {
    describe("#setDefaults()", function () {
        it("assigns to empty object", function () {
            chai_1.assert.deepStrictEqual((0, set_defaults_1.setDefaults)({}, { a: 1, b: 2 }), { a: 1, b: 2 });
        });
        it("does not override inputs", function () {
            chai_1.assert.deepStrictEqual((0, set_defaults_1.setDefaults)({ a: 3 }, { a: 1, b: 2 }), {
                a: 3,
                b: 2,
            });
        });
        it("accepts undefined inputs", function () {
            chai_1.assert.deepStrictEqual((0, set_defaults_1.setDefaults)(undefined, { a: 1, b: 2 }), {
                a: 1,
                b: 2,
            });
        });
        it("keeps extra input properties", function () {
            // @ts-ignore TS compiler forbids the "c" key but since this is JS and the
            // compiler is no guarantee i want to test for this case too.
            chai_1.assert.deepStrictEqual((0, set_defaults_1.setDefaults)({ c: 3 }, { a: 1, b: 2 }), {
                a: 1,
                b: 2,
                c: 3,
            });
        });
    });
});
//# sourceMappingURL=set-defaults.spec.js.map