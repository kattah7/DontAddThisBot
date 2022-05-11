"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const emote_sets_1 = require("./emote-sets");
describe("./message/parser/emote-sets", function () {
    describe("#parseEmoteSets()", function () {
        it("should parse empty string as empty list", function () {
            chai_1.assert.deepStrictEqual((0, emote_sets_1.parseEmoteSets)(""), []);
        });
        it("should parse single digit as single element array", function () {
            chai_1.assert.deepStrictEqual((0, emote_sets_1.parseEmoteSets)("0"), ["0"]);
            chai_1.assert.deepStrictEqual((0, emote_sets_1.parseEmoteSets)("100"), ["100"]);
        });
        it("should ignore empty emote set IDs (two adjacent commas)", function () {
            chai_1.assert.deepStrictEqual((0, emote_sets_1.parseEmoteSets)("0,,,100,200,,33,4"), [
                "0",
                "100",
                "200",
                "33",
                "4",
            ]);
        });
        it("should parse multiple emote sets correctly", function () {
            chai_1.assert.deepStrictEqual((0, emote_sets_1.parseEmoteSets)("0,100,200,33,4"), [
                "0",
                "100",
                "200",
                "33",
                "4",
            ]);
        });
        it("should be able to accept non-number emote set IDs", function () {
            // it is doubtful twitch ever does this, but nowhere does it say
            // emote set IDs have to be numeric, so just make sure we're safe.
            chai_1.assert.deepStrictEqual((0, emote_sets_1.parseEmoteSets)("0,1,2-extra,something-else"), [
                "0",
                "1",
                "2-extra",
                "something-else",
            ]);
        });
    });
});
//# sourceMappingURL=emote-sets.spec.js.map