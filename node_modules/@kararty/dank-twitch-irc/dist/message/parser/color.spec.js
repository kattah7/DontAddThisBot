"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helpers_spec_1 = require("../../helpers.spec");
const color_1 = require("./color");
const parse_error_1 = require("./parse-error");
describe("./message/parser/color", function () {
    describe("#parseColor()", function () {
        it("should parse numeric color string", function () {
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#000000"), {
                r: 0x00,
                g: 0x00,
                b: 0x00,
            });
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#123456"), {
                r: 0x12,
                g: 0x34,
                b: 0x56,
            });
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#789011"), {
                r: 0x78,
                g: 0x90,
                b: 0x11,
            });
        });
        it("should parse uppercase hex color string", function () {
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#AABBCC"), {
                r: 0xaa,
                g: 0xbb,
                b: 0xcc,
            });
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#FFFFFF"), {
                r: 0xff,
                g: 0xff,
                b: 0xff,
            });
        });
        it("should parse lowercase hex color string", function () {
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#aabbcc"), {
                r: 0xaa,
                g: 0xbb,
                b: 0xcc,
            });
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#ffffff"), {
                r: 0xff,
                g: 0xff,
                b: 0xff,
            });
        });
        it("should parse mixed-case hex color string", function () {
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#aAbBcC"), {
                r: 0xaa,
                g: 0xbb,
                b: 0xcc,
            });
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#FFffFF"), {
                r: 0xff,
                g: 0xff,
                b: 0xff,
            });
        });
        it("should parse alphanumeric hex color string", function () {
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#A7F1FF"), {
                r: 0xa7,
                g: 0xf1,
                b: 0xff,
            });
            chai_1.assert.deepStrictEqual((0, color_1.parseColor)("#FF00FF"), {
                r: 0xff,
                g: 0x00,
                b: 0xff,
            });
        });
        it("should throw ParseError on missing leading hash", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, color_1.parseColor)("aabbcc"), parse_error_1.ParseError, 'Malformed color value "aabbcc", must be in format #AABBCC');
        });
        it("should throw ParseError on too-long input string", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, color_1.parseColor)("aabbccFF"), parse_error_1.ParseError, 'Malformed color value "aabbccFF", must be in format #AABBCC');
        });
        it("should throw ParseError on too-short input string", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, color_1.parseColor)("aabbc"), parse_error_1.ParseError, 'Malformed color value "aabbc", must be in format #AABBCC');
        });
        it("should throw ParseError on out-of-range hex characters input string", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, color_1.parseColor)("AAAEAA"), parse_error_1.ParseError, 'Malformed color value "AAAEAA", must be in format #AABBCC');
        });
    });
});
//# sourceMappingURL=color.spec.js.map