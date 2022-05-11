"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const apply_function_replacements_1 = require("./apply-function-replacements");
// tslint:disable:max-classes-per-file
describe("./utils/apply-function-replacements", function () {
    describe("#applyReplacement", function () {
        it("should delegate execution properly", function () {
            const self = {
                abc: "def",
            };
            class Target {
                something = "KKona";
                a(one, two, three) {
                    // test for the "this" reference in this class
                    return this.something + one + two + three;
                }
            }
            const target = new Target();
            (0, apply_function_replacements_1.applyReplacement)(self, target, "a", function a(originalFn, one, two, three) {
                // test for the "this" reference in the replacement function
                return originalFn(one, two, three) + this.abc;
            });
            chai_1.assert.strictEqual(target.a("1", "2", "3"), "KKona123def");
        });
        it("should not create a enumerable property on the target object", function () {
            const self = {};
            class Target {
                a() {
                    return "a";
                }
            }
            const target = new Target();
            chai_1.assert.deepStrictEqual(Object.keys(target), []);
            (0, apply_function_replacements_1.applyReplacement)(self, target, "a", function a(originalFn) {
                return originalFn();
            });
            chai_1.assert.deepStrictEqual(Object.keys(target), []);
        });
    });
    describe("#applyReplacements()", function () {
        it("should apply all replacements given in functions map", function () {
            const self = {
                abc: "def",
            };
            class Target {
                a() {
                    return "a";
                }
                b() {
                    return "b";
                }
                c() {
                    return "c";
                }
            }
            const target = new Target();
            (0, apply_function_replacements_1.applyReplacements)(self, target, {
                a(originalFn) {
                    return originalFn() + "x";
                },
                b(originalFn) {
                    return originalFn() + "y";
                },
                c(originalFn) {
                    return originalFn() + "z";
                },
            });
            chai_1.assert.strictEqual(target.a(), "ax");
            chai_1.assert.strictEqual(target.b(), "by");
            chai_1.assert.strictEqual(target.c(), "cz");
        });
    });
});
//# sourceMappingURL=apply-function-replacements.spec.js.map