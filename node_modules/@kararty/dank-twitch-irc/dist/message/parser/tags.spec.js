"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const tags_1 = require("./tags");
describe("./message/parser/tags", function () {
    describe("#decodeValue()", function () {
        it("should decode undefined as null", function () {
            chai_1.assert.isNull((0, tags_1.decodeValue)(undefined));
        });
        it("should decode empty string as empty string", function () {
            chai_1.assert.strictEqual("", (0, tags_1.decodeValue)(""));
        });
        it("should decode semicolons", function () {
            chai_1.assert.strictEqual("abc;def", (0, tags_1.decodeValue)("abc\\:def"));
            chai_1.assert.strictEqual(";", (0, tags_1.decodeValue)("\\:"));
        });
        it("should decode spaces", function () {
            chai_1.assert.strictEqual("abc def", (0, tags_1.decodeValue)("abc\\sdef"));
            chai_1.assert.strictEqual(" ", (0, tags_1.decodeValue)("\\s"));
        });
        it("should decode backslashes", function () {
            chai_1.assert.strictEqual("abc\\def", (0, tags_1.decodeValue)("abc\\\\def"));
            chai_1.assert.strictEqual("\\", (0, tags_1.decodeValue)("\\\\"));
        });
        it("should decode CR", function () {
            chai_1.assert.strictEqual("abc\rdef", (0, tags_1.decodeValue)("abc\\rdef"));
            chai_1.assert.strictEqual("\r", (0, tags_1.decodeValue)("\\r"));
        });
        it("should decode LF", function () {
            chai_1.assert.strictEqual("abc\ndef", (0, tags_1.decodeValue)("abc\\ndef"));
            chai_1.assert.strictEqual("\n", (0, tags_1.decodeValue)("\\n"));
        });
        it("should not apply unescaping multiple times", function () {
            chai_1.assert.strictEqual("abc\\ndef", (0, tags_1.decodeValue)("abc\\\\ndef"));
        });
        it("should ignore dangling backslashes", function () {
            chai_1.assert.strictEqual("abc def", (0, tags_1.decodeValue)("abc\\sdef\\"));
        });
        it("should support a combination of all escape sequences", function () {
            chai_1.assert.strictEqual("abc; \\\r\ndef", (0, tags_1.decodeValue)("abc\\:\\s\\\\\\r\\ndef\\"));
        });
    });
    describe("#parseTags()", function () {
        it("should parse no-value tag as null", function () {
            chai_1.assert.deepStrictEqual((0, tags_1.parseTags)("enabled"), { enabled: null });
        });
        it("should parse empty-value tag as empty string", function () {
            chai_1.assert.deepStrictEqual((0, tags_1.parseTags)("enabled="), { enabled: "" });
        });
        it("should keep boolean/numeric values as-is without coercion", function () {
            chai_1.assert.deepStrictEqual((0, tags_1.parseTags)("enabled=1"), { enabled: "1" });
        });
        it("should decode escaped tag values", function () {
            chai_1.assert.deepStrictEqual((0, tags_1.parseTags)("message=Hello\\sWorld!"), {
                message: "Hello World!",
            });
        });
        it("should override double tags with the last definition", function () {
            chai_1.assert.deepStrictEqual((0, tags_1.parseTags)("message=1;message=2"), {
                message: "2",
            });
        });
        it("should override double tags with the last definition, even if value is null", function () {
            chai_1.assert.deepStrictEqual((0, tags_1.parseTags)("message=1;message"), { message: null });
        });
        it("should to-lower-case tag keys", function () {
            chai_1.assert.deepStrictEqual((0, tags_1.parseTags)("MESSAGE=Hi"), { message: "Hi" });
        });
        it("should support multiple different keys", function () {
            chai_1.assert.deepStrictEqual((0, tags_1.parseTags)("abc=1;def=2;xd;xd;hi=;abc"), {
                abc: null,
                def: "2",
                xd: null,
                hi: "",
            });
        });
    });
});
//# sourceMappingURL=tags.spec.js.map