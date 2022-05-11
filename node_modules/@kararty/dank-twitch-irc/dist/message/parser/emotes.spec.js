"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helpers_spec_1 = require("../../helpers.spec");
const emote_1 = require("../emote");
const emotes_1 = require("./emotes");
const parse_error_1 = require("./parse-error");
describe("./message/parser/emotes", function () {
    describe("#parseEmotes()", function () {
        it("should parse empty string as no emotes", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)("", ""), []);
        });
        it("should parse single emote", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)(":)", "1:0-1"), [
                new emote_1.TwitchEmote("1", 0, 2, ":)"),
            ]);
        });
        it("should parse multiple instances of the same emote", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)(":) :)", "1:0-1,3-4"), [
                new emote_1.TwitchEmote("1", 0, 2, ":)"),
                new emote_1.TwitchEmote("1", 3, 5, ":)"),
            ]);
        });
        it("should parse multiple emotes in the same message", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)("Kappa Keepo", "25:0-4/1902:6-10"), [
                new emote_1.TwitchEmote("25", 0, 5, "Kappa"),
                new emote_1.TwitchEmote("1902", 6, 11, "Keepo"),
            ]);
        });
        it("should sort results by start index", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)("Kappa Keepo Kappa", "25:0-4,12-16/1902:6-10"), [
                new emote_1.TwitchEmote("25", 0, 5, "Kappa"),
                new emote_1.TwitchEmote("1902", 6, 11, "Keepo"),
                new emote_1.TwitchEmote("25", 12, 17, "Kappa"),
            ]);
        });
        it("should throw a ParseError if emote index range has no dash", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, emotes_1.parseEmotes)("", "25:12"), parse_error_1.ParseError, 'No - found in emote index range "12"');
        });
        it("should accept non-integer emote IDs", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)(":)", "asd:0-1"), [
                new emote_1.TwitchEmote("asd", 0, 2, ":)"),
            ]);
        });
        it("should throw a ParseError if the from index is not a valid integer", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, emotes_1.parseEmotes)("", "25:abc-5"), parse_error_1.ParseError, 'Invalid integer for string "abc"');
        });
        it("should throw a ParseError if the to index is not a valid integer", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, emotes_1.parseEmotes)("", "25:0-abc"), parse_error_1.ParseError, 'Invalid integer for string "abc"');
        });
        it("should gracefully handle it if a end index is out of range (1)", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)("Kappa", "25:0-5"), [
                new emote_1.TwitchEmote("25", 0, 5, "Kappa"),
            ]);
        });
        it("should gracefully handle it if a start index is out of range (2)", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)("Kappa", "25:1-5"), [
                new emote_1.TwitchEmote("25", 1, 5, "appa"),
            ]);
        });
        it("should gracefully handle it if an end index is extremely out of range", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)("Kappa", "25:2-10"), [
                new emote_1.TwitchEmote("25", 2, 5, "ppa"),
            ]);
        });
        it("should parse correctly with emoji present", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)("-tags 👉 <3", "483:8-9"), [
                new emote_1.TwitchEmote("483", 8, 10, "<3"),
            ]);
        });
        it("should parse multiple instances of the same emote if preceeded by emoji", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)("👉 <3 👉 <3", "445:2-3,7-8"), [
                new emote_1.TwitchEmote("445", 2, 4, "<3"),
                new emote_1.TwitchEmote("445", 7, 9, "<3"),
            ]);
        });
        it("should parse multiple emotes in the same message when multiple emojis exist between them", function () {
            chai_1.assert.deepStrictEqual((0, emotes_1.parseEmotes)("🌚 Kappa 🌚 🐈 Keepo 🐈 🎨 KappaRoss 🎨", "25:2-6/1902:12-16/70433:22-30"), [
                new emote_1.TwitchEmote("25", 2, 7, "Kappa"),
                new emote_1.TwitchEmote("1902", 12, 17, "Keepo"),
                new emote_1.TwitchEmote("70433", 22, 31, "KappaRoss"),
            ]);
        });
    });
});
//# sourceMappingURL=emotes.spec.js.map