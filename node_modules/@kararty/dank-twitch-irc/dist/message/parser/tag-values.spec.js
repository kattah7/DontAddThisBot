"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helpers_spec_1 = require("../../helpers.spec");
const badge_1 = require("../badge");
const badges_1 = require("../badges");
const emote_1 = require("../emote");
const missing_tag_error_1 = require("./missing-tag-error");
const parse_error_1 = require("./parse-error");
const tag_values_1 = require("./tag-values");
describe("./message/parser/tag-values", function () {
    function checkRequire(subject, ...converterArgs) {
        describe("#requireData", function () {
            it("should throw MissingTagError on missing key", function () {
                (0, helpers_spec_1.assertThrowsChain)(() => subject((0, tag_values_1.tagParserFor)({}))("key", ...converterArgs), missing_tag_error_1.MissingTagError, 'Required tag value not present at key "key" (is undefined)');
            });
            it("should throw MissingTagError on null value", function () {
                (0, helpers_spec_1.assertThrowsChain)(() => subject((0, tag_values_1.tagParserFor)({ key: null }))("key", ...converterArgs), missing_tag_error_1.MissingTagError, 'Required tag value not present at key "key" (is null)');
            });
        });
    }
    function checkGet(subject, ...converterArgs) {
        describe("#getData", function () {
            it("should return undefined on missing key", function () {
                chai_1.assert.isUndefined(subject((0, tag_values_1.tagParserFor)({}))("key", ...converterArgs));
            });
            it("should return undefined on null value", function () {
                chai_1.assert.isUndefined(subject((0, tag_values_1.tagParserFor)({ key: null }))("key", ...converterArgs));
            });
        });
    }
    describe("#getString(), #requireString()", function () {
        checkGet((p) => p.getString);
        checkRequire((p) => p.requireString);
        it("should return the value if value exists (also on empty string)", function () {
            chai_1.assert.strictEqual((0, tag_values_1.tagParserFor)({ key: "value" }).getString("key"), "value");
            chai_1.assert.strictEqual((0, tag_values_1.tagParserFor)({ key: "value" }).requireString("key"), "value");
            chai_1.assert.strictEqual((0, tag_values_1.tagParserFor)({ key: "" }).getString("key"), "");
            chai_1.assert.strictEqual((0, tag_values_1.tagParserFor)({ key: "" }).requireString("key"), "");
        });
    });
    function checkThrowsUnparseableInt(subject, ...converterArgs) {
        it("should throw ParseError on empty string input", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => subject((0, tag_values_1.tagParserFor)({ key: "" }))("key", ...converterArgs), parse_error_1.ParseError, 'Failed to parse integer from tag value ""');
        });
        it("should throw ParseError on invalid integer input", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => subject((0, tag_values_1.tagParserFor)({ key: "abc" }))("key", ...converterArgs), parse_error_1.ParseError, 'Failed to parse integer from tag value "abc"');
        });
    }
    describe("#getInt(), #requireInt()", function () {
        checkGet((p) => p.getInt);
        checkRequire((p) => p.requireInt);
        checkThrowsUnparseableInt((p) => p.getInt);
        checkThrowsUnparseableInt((p) => p.requireInt);
        it("should return a number if value exists and was parseable", function () {
            chai_1.assert.strictEqual(15, (0, tag_values_1.tagParserFor)({ key: "15" }).getInt("key"));
            chai_1.assert.strictEqual(15, (0, tag_values_1.tagParserFor)({ key: "15" }).requireInt("key"));
        });
    });
    describe("#getBoolean(), #requireBoolean()", function () {
        checkGet((p) => p.getBoolean);
        checkRequire((p) => p.requireBoolean);
        checkThrowsUnparseableInt((p) => p.getInt);
        checkThrowsUnparseableInt((p) => p.requireInt);
        it("should return false if the parsed integer is 0", function () {
            chai_1.assert.isFalse((0, tag_values_1.tagParserFor)({ key: "0" }).getBoolean("key"));
            chai_1.assert.isFalse((0, tag_values_1.tagParserFor)({ key: "0.0" }).getBoolean("key"));
        });
        it("should return false if the parsed integer is non-0", function () {
            chai_1.assert.isTrue((0, tag_values_1.tagParserFor)({ key: "1" }).getBoolean("key"));
            chai_1.assert.isTrue((0, tag_values_1.tagParserFor)({ key: "-1" }).getBoolean("key"));
            chai_1.assert.isTrue((0, tag_values_1.tagParserFor)({ key: "15" }).getBoolean("key"));
            chai_1.assert.isTrue((0, tag_values_1.tagParserFor)({ key: "-15" }).getBoolean("key"));
        });
    });
    describe("#getColor(), #requireColor()", function () {
        checkGet((p) => p.getColor);
        checkRequire((p) => p.requireColor);
        it("should parse #RRGGBB color input correctly", function () {
            chai_1.assert.deepStrictEqual((0, tag_values_1.tagParserFor)({ key: "#aabbcc" }).getColor("key"), {
                r: 0xaa,
                g: 0xbb,
                b: 0xcc,
            });
            chai_1.assert.deepStrictEqual((0, tag_values_1.tagParserFor)({ key: "#AABBCC" }).getColor("key"), {
                r: 0xaa,
                g: 0xbb,
                b: 0xcc,
            });
            chai_1.assert.deepStrictEqual((0, tag_values_1.tagParserFor)({ key: "#12D3FF" }).getColor("key"), {
                r: 0x12,
                g: 0xd3,
                b: 0xff,
            });
        });
        it("#getColor() should return undefined on empty string input", function () {
            chai_1.assert.isUndefined((0, tag_values_1.tagParserFor)({ key: "" }).getColor("key"));
        });
        it("#requireColor() should throw MissingDataError on empty string input", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, tag_values_1.tagParserFor)({ key: "" }).requireColor("key"), missing_tag_error_1.MissingTagError, 'Required tag value not present at key "key" (is empty string)');
        });
    });
    describe("#getTimestamp(), #requireTimestamp()", function () {
        checkGet((p) => p.getTimestamp);
        checkRequire((p) => p.requireTimestamp);
        checkThrowsUnparseableInt((p) => p.getTimestamp);
        checkThrowsUnparseableInt((p) => p.requireTimestamp);
        it("should interpret given integer values as milliseconds since UTC epoch", function () {
            chai_1.assert.strictEqual((0, tag_values_1.tagParserFor)({ key: "1234567" }).requireTimestamp("key").getTime(), 1234567);
        });
    });
    describe("#getBadges(), #requireBadges()", function () {
        checkGet((p) => p.getBadges);
        checkRequire((p) => p.requireBadges);
        it("should return an empty list on empty string input", function () {
            chai_1.assert.deepStrictEqual((0, tag_values_1.tagParserFor)({ key: "" }).getBadges("key"), new badges_1.TwitchBadgesList());
        });
        it("should return single-element array on single badge", function () {
            chai_1.assert.deepStrictEqual((0, tag_values_1.tagParserFor)({ key: "admin/1" }).getBadges("key"), new badges_1.TwitchBadgesList(new badge_1.TwitchBadge("admin", "1")));
        });
        it("should accept two badges in the tag source", function () {
            chai_1.assert.deepStrictEqual((0, tag_values_1.tagParserFor)({ key: "admin/1,subscriber/32" }).getBadges("key"), new badges_1.TwitchBadgesList(new badge_1.TwitchBadge("admin", "1"), new badge_1.TwitchBadge("subscriber", "32")));
        });
        it("should accept three badges in the tag source", function () {
            chai_1.assert.deepStrictEqual((0, tag_values_1.tagParserFor)({ key: "admin/1,subscriber/32,bits/1000" }).getBadges("key"), new badges_1.TwitchBadgesList(new badge_1.TwitchBadge("admin", "1"), new badge_1.TwitchBadge("subscriber", "32"), new badge_1.TwitchBadge("bits", "1000")));
        });
    });
    describe("#getTagEmotes()", function () {
        checkGet((p) => p.getEmotes, "lul");
        checkRequire((p) => p.requireEmoteSets, "lul");
        it("should return an empty list on empty string input", function () {
            const actual = (0, tag_values_1.tagParserFor)({ key: "" }).getEmotes("key", "test");
            chai_1.assert.deepStrictEqual(actual, []);
        });
        it("should return single-element array on single emote", function () {
            const actual = (0, tag_values_1.tagParserFor)({ key: "25:4-8" }).getEmotes("key", "asd Kappa def");
            chai_1.assert.deepStrictEqual(actual, [new emote_1.TwitchEmote("25", 4, 9, "Kappa")]);
        });
        it("should return 2-element array on 2 identical emotes", function () {
            const actual = (0, tag_values_1.tagParserFor)({ key: "25:4-8,14-18" }).getEmotes("key", "asd Kappa def Kappa def");
            chai_1.assert.deepStrictEqual(actual, [
                new emote_1.TwitchEmote("25", 4, 9, "Kappa"),
                new emote_1.TwitchEmote("25", 14, 19, "Kappa"),
            ]);
        });
        it("should return 2-element array on 2 different emotes", function () {
            const actual = (0, tag_values_1.tagParserFor)({ key: "25:4-8/1902:14-18" }).getEmotes("key", "asd Kappa def Keepo def");
            chai_1.assert.deepStrictEqual(actual, [
                new emote_1.TwitchEmote("25", 4, 9, "Kappa"),
                new emote_1.TwitchEmote("1902", 14, 19, "Keepo"),
            ]);
        });
        it("should return a correctly sorted 3-element array on interleaved emotes", function () {
            const actual = (0, tag_values_1.tagParserFor)({ key: "25:5-9,27-31/1902:16-20" }).getEmotes("key", "test Kappa test Keepo test Kappa");
            chai_1.assert.deepStrictEqual(actual, [
                new emote_1.TwitchEmote("25", 5, 10, "Kappa"),
                new emote_1.TwitchEmote("1902", 16, 21, "Keepo"),
                new emote_1.TwitchEmote("25", 27, 32, "Kappa"),
            ]);
        });
    });
    describe("#getEmoteSets(), #requireEmoteSets()", function () {
        checkGet((p) => p.getEmoteSets);
        checkRequire((p) => p.requireEmoteSets);
        it("should return an empty list on empty string input", function () {
            const actual = (0, tag_values_1.tagParserFor)({ key: "" }).getEmoteSets("key");
            chai_1.assert.deepStrictEqual(actual, []);
        });
        it("should parse one emote set correctly", function () {
            const actual = (0, tag_values_1.tagParserFor)({ key: "0" }).getEmoteSets("key");
            chai_1.assert.deepStrictEqual(actual, ["0"]);
        });
        it("should parse two emote set correctly", function () {
            const actual = (0, tag_values_1.tagParserFor)({ key: "0,3343" }).getEmoteSets("key");
            chai_1.assert.deepStrictEqual(actual, ["0", "3343"]);
        });
        it("should parse three emote set correctly", function () {
            // also tests that function preserves order (no sorting)
            const actual = (0, tag_values_1.tagParserFor)({ key: "0,7897,3343" }).getEmoteSets("key");
            chai_1.assert.deepStrictEqual(actual, ["0", "7897", "3343"]);
        });
    });
});
//# sourceMappingURL=tag-values.spec.js.map