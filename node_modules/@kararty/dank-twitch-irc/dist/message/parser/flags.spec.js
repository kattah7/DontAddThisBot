"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const flag_1 = require("../flag");
const flags_1 = require("./flags");
describe("./message/parser/flags", function () {
    describe("#parseFlags()", function () {
        it("should parse empty string as no flags", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("", ""), []);
        });
        it("should parse single flag, with one I category", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("retard streamer", "0-5:I.3"), [
                new flag_1.TwitchFlag(0, 6, "retard", [{ category: "I", score: 3 }]),
            ]);
        });
        it("should parse single flag, with one S category", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("a phallic object", "2-8:S.7"), [
                new flag_1.TwitchFlag(2, 9, "phallic", [{ category: "S", score: 7 }]),
            ]);
        });
        it("should parse single flag, with one A category", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("you kill", "4-7:A.7"), [
                new flag_1.TwitchFlag(4, 8, "kill", [{ category: "A", score: 7 }]),
            ]);
        });
        it("should parse single flag, with one P category", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("stfu", "0-3:P.6"), [
                new flag_1.TwitchFlag(0, 4, "stfu", [{ category: "P", score: 6 }]),
            ]);
        });
        it("should parse multiple instances of the same flag, with one P category", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("shit in my asshole", "0-3:P.6,11-17:P.6"), [
                new flag_1.TwitchFlag(0, 4, "shit", [{ category: "P", score: 6 }]),
                new flag_1.TwitchFlag(11, 18, "asshole", [{ category: "P", score: 6 }]),
            ]);
        });
        it("should sort results by start index", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("shit in my asshole fucking shit mechanics", "0-3:P.7,11-17:P.7,19-25:P.7,27-30:P.7"), [
                new flag_1.TwitchFlag(0, 4, "shit", [{ category: "P", score: 7 }]),
                new flag_1.TwitchFlag(11, 18, "asshole", [{ category: "P", score: 7 }]),
                new flag_1.TwitchFlag(19, 26, "fucking", [{ category: "P", score: 7 }]),
                new flag_1.TwitchFlag(27, 31, "shit", [{ category: "P", score: 7 }]),
            ]);
        });
        it("should parse four flags, with multiple categories", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("shut the fuck up retard streamer you kill a phallic object", "0-15:A.7/I.6/P.6,17-22:A.7/I.6,37-40:A.7,44-50:S.7"), [
                new flag_1.TwitchFlag(0, 16, "shut the fuck up", [
                    { category: "A", score: 7 },
                    { category: "I", score: 6 },
                    { category: "P", score: 6 },
                ]),
                new flag_1.TwitchFlag(17, 23, "retard", [
                    { category: "A", score: 7 },
                    { category: "I", score: 6 },
                ]),
                new flag_1.TwitchFlag(37, 41, "kill", [{ category: "A", score: 7 }]),
                new flag_1.TwitchFlag(44, 51, "phallic", [{ category: "S", score: 7 }]),
            ]);
        });
        it("should parse single flag, but with empty categories", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("$test xanax", "6-10:"), [
                new flag_1.TwitchFlag(6, 11, "xanax", []),
            ]);
        });
        it("should gracefully handle if an end index is out of range", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("stfu", "0-4:P.6"), [
                // if index wasnt out of range, this would be (0, 5)
                new flag_1.TwitchFlag(0, 4, "stfu", [{ category: "P", score: 6 }]),
            ]);
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("stf", "0-4:P.6"), [
                // if index wasnt out of range, this would be (0, 5)
                new flag_1.TwitchFlag(0, 3, "stf", [{ category: "P", score: 6 }]),
            ]);
        });
        it("should parse normal string with no flags, as no flags", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("Kappa Keepo KappaRoss", ""), []);
        });
        it("should parse no flag if the category's score is a string", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("stfu", "0-3:P.abc"), []);
        });
        it("should parse no flag if the flag index range has no dash", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("", "3:P.7"), []);
        });
        it("should parse no flag if the from index is not a valid integer", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("", "abc-3:P.7"), []);
        });
        it("should parse no flag if the to index is not a valid integer", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("", "0-abc:P.7"), []);
        });
        it("should parse no flag, in case Twitch changes the functionality", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("stfu", "0-3=PRO.100%"), []);
        });
        it("should parse single flag, with three categories", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("shut the fuck up", "0-15:A.7/I.6/P.6"), [
                new flag_1.TwitchFlag(0, 16, "shut the fuck up", [
                    { category: "A", score: 7 },
                    { category: "I", score: 6 },
                    { category: "P", score: 6 },
                ]),
            ]);
        });
        it("should parse two flags, but both with empty categories", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("$test xanax and xanax", "6-10:,16-20:"), [
                new flag_1.TwitchFlag(6, 11, "xanax", []),
                new flag_1.TwitchFlag(16, 21, "xanax", []),
            ]);
        });
        it("should parse six flags, four with multiple categories and two with empty categories", function () {
            chai_1.assert.deepStrictEqual((0, flags_1.parseFlags)("shut the fuck up retard streamer you kill a phallic object and xanax and xanax", "0-15:A.7/I.6/P.6,17-22:A.7/I.6,37-40:A.7,44-50:S.7,63-67:,73-77:"), [
                new flag_1.TwitchFlag(0, 16, "shut the fuck up", [
                    { category: "A", score: 7 },
                    { category: "I", score: 6 },
                    { category: "P", score: 6 },
                ]),
                new flag_1.TwitchFlag(17, 23, "retard", [
                    { category: "A", score: 7 },
                    { category: "I", score: 6 },
                ]),
                new flag_1.TwitchFlag(37, 41, "kill", [{ category: "A", score: 7 }]),
                new flag_1.TwitchFlag(44, 51, "phallic", [{ category: "S", score: 7 }]),
                new flag_1.TwitchFlag(63, 68, "xanax", []),
                new flag_1.TwitchFlag(73, 78, "xanax", []),
            ]);
        });
    });
});
//# sourceMappingURL=flags.spec.js.map