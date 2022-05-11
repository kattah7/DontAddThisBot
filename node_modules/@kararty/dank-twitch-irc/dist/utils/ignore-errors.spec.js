"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ignore_errors_1 = require("./ignore-errors");
describe("./utils/ignore-errors", function () {
    describe("#ignoreErrors()", function () {
        it("should ignore errors as the first argument and return undefined", function () {
            // @ts-ignore more arguments than expected
            chai_1.assert.isUndefined((0, ignore_errors_1.ignoreErrors)(new Error("something bad")));
        });
        it("should return undefined with no arguments", function () {
            chai_1.assert.isUndefined((0, ignore_errors_1.ignoreErrors)());
        });
        it("should make a rejected promise return undefined if used as catch handler", async function () {
            const promise = Promise.reject(new Error("something bad"));
            chai_1.assert.isUndefined(await promise.catch(ignore_errors_1.ignoreErrors));
        });
        it("should not alter a resolved promise if used as catch handler", async function () {
            const promise = Promise.resolve("something good");
            chai_1.assert.strictEqual(await promise.catch(ignore_errors_1.ignoreErrors), "something good");
        });
    });
});
//# sourceMappingURL=ignore-errors.spec.js.map