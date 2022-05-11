"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const is_anonymous_username_1 = require("./is-anonymous-username");
describe("./utils/is-anonymous-username", function () {
    describe("#isAnonymousUsername()", function () {
        it("should be true for valid justinfan usernames", function () {
            chai_1.assert.isTrue((0, is_anonymous_username_1.isAnonymousUsername)("justinfan12345"));
            chai_1.assert.isTrue((0, is_anonymous_username_1.isAnonymousUsername)("justinfan1"));
            chai_1.assert.isTrue((0, is_anonymous_username_1.isAnonymousUsername)("justinfan99"));
            chai_1.assert.isTrue((0, is_anonymous_username_1.isAnonymousUsername)("justinfan999"));
            chai_1.assert.isTrue((0, is_anonymous_username_1.isAnonymousUsername)("justinfan9999"));
            chai_1.assert.isTrue((0, is_anonymous_username_1.isAnonymousUsername)("justinfan99999"));
            chai_1.assert.isTrue((0, is_anonymous_username_1.isAnonymousUsername)("justinfan999999"));
            chai_1.assert.isTrue((0, is_anonymous_username_1.isAnonymousUsername)("justinfan9999999"));
            chai_1.assert.isTrue((0, is_anonymous_username_1.isAnonymousUsername)("justinfan99999999"));
        });
        it("should be false if username only matches partially", function () {
            chai_1.assert.isFalse((0, is_anonymous_username_1.isAnonymousUsername)("some_justinfan12345"));
            chai_1.assert.isFalse((0, is_anonymous_username_1.isAnonymousUsername)("justinfan12345kappa"));
            chai_1.assert.isFalse((0, is_anonymous_username_1.isAnonymousUsername)("some_justinfan12345kappa"));
        });
        it("should be false if justinfan is capitalized incorrectly", function () {
            chai_1.assert.isFalse((0, is_anonymous_username_1.isAnonymousUsername)("Justinfan12345"));
        });
    });
});
//# sourceMappingURL=is-anonymous-username.spec.js.map