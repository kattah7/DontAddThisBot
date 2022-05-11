"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const make_error_cause_1 = require("make-error-cause");
const any_cause_instanceof_1 = require("./any-cause-instanceof");
describe("./utils/any-cause-instanceof", function () {
    describe("#causeOf()", function () {
        it("returns undefined on Error", function () {
            chai_1.assert.isUndefined((0, any_cause_instanceof_1.causeOf)(new Error()));
        });
        it("returns the cause on BaseErrors", function () {
            // given
            const cause = new Error("cause");
            const error = new make_error_cause_1.BaseError("error", cause);
            // when
            const gottenCause = (0, any_cause_instanceof_1.causeOf)(error);
            // then
            chai_1.assert.strictEqual(gottenCause, cause);
        });
        it("ignores #cause property on non-BaseErrors", function () {
            // given
            const error = new Error("error");
            // @ts-ignore
            error.cause = "cause string";
            // when
            const gottenCause = (0, any_cause_instanceof_1.causeOf)(error);
            // then
            chai_1.assert.isUndefined(gottenCause);
        });
    });
    describe("#anyCauseInstanceof()", function () {
        // tslint:disable:max-classes-per-file
        class TestErrorA extends make_error_cause_1.BaseError {
        }
        class TestErrorB extends make_error_cause_1.BaseError {
        }
        class TestErrorC extends make_error_cause_1.BaseError {
        }
        it("returns false on undefined input", function () {
            chai_1.assert.isFalse((0, any_cause_instanceof_1.anyCauseInstanceof)(undefined, Error));
            chai_1.assert.isFalse((0, any_cause_instanceof_1.anyCauseInstanceof)(undefined, TestErrorA));
        });
        it("works on errors without a cause field", function () {
            const error = Error("E");
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(error, Error));
            chai_1.assert.isFalse((0, any_cause_instanceof_1.anyCauseInstanceof)(error, TestErrorA));
            chai_1.assert.isFalse((0, any_cause_instanceof_1.anyCauseInstanceof)(error, TestErrorB));
            chai_1.assert.isFalse((0, any_cause_instanceof_1.anyCauseInstanceof)(error, TestErrorC));
        });
        it("level 0", function () {
            const errorA = new TestErrorA("A");
            // validate that the function finds the error at level 0 (top-level/the error that was passed)
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(errorA, Error));
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(errorA, TestErrorA));
            chai_1.assert.isFalse((0, any_cause_instanceof_1.anyCauseInstanceof)(errorA, TestErrorB));
            chai_1.assert.isFalse((0, any_cause_instanceof_1.anyCauseInstanceof)(errorA, TestErrorC));
        });
        it("level 1", function () {
            const errorA = new TestErrorA("A");
            const errorB = new TestErrorB("B", errorA);
            // validate that the function finds the error at level 1
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(errorB, Error));
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(errorB, TestErrorA));
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(errorB, TestErrorB));
            chai_1.assert.isFalse((0, any_cause_instanceof_1.anyCauseInstanceof)(errorB, TestErrorC));
        });
        it("level 2", function () {
            const errorA = new TestErrorA("A");
            const errorB = new TestErrorB("B", errorA);
            const errorC = new TestErrorC("C", errorB);
            // validate that the function finds the error at level 2
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(errorC, Error));
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(errorC, make_error_cause_1.BaseError));
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(errorC, TestErrorA));
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(errorC, TestErrorB));
            chai_1.assert.isTrue((0, any_cause_instanceof_1.anyCauseInstanceof)(errorC, TestErrorC));
        });
    });
});
//# sourceMappingURL=any-cause-instanceof.spec.js.map