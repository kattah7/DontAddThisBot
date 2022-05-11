"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helpers_spec_1 = require("../../helpers.spec");
const missing_data_error_1 = require("../parser/missing-data-error");
const parse_error_1 = require("../parser/parse-error");
const twitch_message_1 = require("../parser/twitch-message");
const hosttarget_1 = require("./hosttarget");
describe("./message/twitch-types/hosttarget", function () {
    describe("#parseHostedChannelName()", function () {
        it("should throw a ParseError if passed undefined", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, hosttarget_1.parseHostedChannelName)(undefined), parse_error_1.ParseError, "Malformed channel part in HOSTTARGET message: undefined");
        });
        it("should throw a ParseError if passed an empty string", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, hosttarget_1.parseHostedChannelName)(""), parse_error_1.ParseError, "Malformed channel part in HOSTTARGET message: empty string");
        });
        it('should return undefined if passed exactly "-"', function () {
            chai_1.assert.isUndefined((0, hosttarget_1.parseHostedChannelName)("-"));
        });
        it("should return the input string as-is in all other cases", function () {
            chai_1.assert.strictEqual("a", (0, hosttarget_1.parseHostedChannelName)("a"));
            chai_1.assert.strictEqual("xd", (0, hosttarget_1.parseHostedChannelName)("xd"));
            chai_1.assert.strictEqual("pajlada", (0, hosttarget_1.parseHostedChannelName)("pajlada"));
        });
    });
    describe("#parseViewerCount()", function () {
        it("should throw a ParseError if passed undefined", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, hosttarget_1.parseViewerCount)(undefined), parse_error_1.ParseError, "Malformed viewer count part in HOSTTARGET message: undefined");
        });
        it("should throw a ParseError if passed an empty string", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, hosttarget_1.parseViewerCount)(""), parse_error_1.ParseError, "Malformed viewer count part in HOSTTARGET message: empty string");
        });
        it("should throw a ParseError if passed an invalid integer string", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, hosttarget_1.parseViewerCount)("abc"), parse_error_1.ParseError, 'Malformed viewer count part in HOSTTARGET message: "abc"');
        });
        it('should return undefined if passed exactly "-"', function () {
            chai_1.assert.isUndefined((0, hosttarget_1.parseViewerCount)("-"));
        });
        it("should return a parsed number if passed a value integer value", function () {
            chai_1.assert.strictEqual(0, (0, hosttarget_1.parseViewerCount)("0"));
            chai_1.assert.strictEqual(50, (0, hosttarget_1.parseViewerCount)("50"));
        });
    });
    describe("#parsHosttargetParameter()", function () {
        it("should throw a ParseError if passed an empty string", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, hosttarget_1.parseHosttargetParameter)(""), parse_error_1.ParseError, "HOSTTARGET accepts exactly 2 arguments in second parameter, given: empty string");
        });
        it("should throw a ParseError if given more than 2 arguments", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, hosttarget_1.parseHosttargetParameter)("a b c"), parse_error_1.ParseError, 'HOSTTARGET accepts exactly 2 arguments in second parameter, given: "a b c"');
        });
        it("should parse channel name and viewer count if present", function () {
            chai_1.assert.deepStrictEqual((0, hosttarget_1.parseHosttargetParameter)("leebaxd 10"), {
                hostedChannelName: "leebaxd",
                viewerCount: 10,
            });
            chai_1.assert.deepStrictEqual((0, hosttarget_1.parseHosttargetParameter)("leebaxd -"), {
                hostedChannelName: "leebaxd",
                viewerCount: undefined,
            });
            chai_1.assert.deepStrictEqual((0, hosttarget_1.parseHosttargetParameter)("- 10"), {
                hostedChannelName: undefined,
                viewerCount: 10,
            });
            chai_1.assert.deepStrictEqual((0, hosttarget_1.parseHosttargetParameter)("- 0"), {
                hostedChannelName: undefined,
                viewerCount: 0,
            });
            chai_1.assert.deepStrictEqual((0, hosttarget_1.parseHosttargetParameter)("- -"), {
                hostedChannelName: undefined,
                viewerCount: undefined,
            });
        });
    });
    describe("HosttargetMessage", function () {
        it("should parse fresh Host-On message", function () {
            const msgText = ":tmi.twitch.tv HOSTTARGET #randers :leebaxd 0";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, hosttarget_1.HosttargetMessage);
            chai_1.assert.strictEqual(msg.channelName, "randers");
            chai_1.assert.strictEqual(msg.hostedChannelName, "leebaxd");
            chai_1.assert.strictEqual(msg.viewerCount, 0);
            chai_1.assert.isFalse(msg.wasHostModeExited());
            chai_1.assert.isTrue(msg.wasHostModeEntered());
        });
        it("should parse non-fresh Host-On message", function () {
            const msgText = ":tmi.twitch.tv HOSTTARGET #randers :leebaxd -";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, hosttarget_1.HosttargetMessage);
            chai_1.assert.strictEqual(msg.channelName, "randers");
            chai_1.assert.strictEqual(msg.hostedChannelName, "leebaxd");
            chai_1.assert.isUndefined(msg.viewerCount);
            chai_1.assert.isFalse(msg.wasHostModeExited());
            chai_1.assert.isTrue(msg.wasHostModeEntered());
        });
        it("should parse host exit message", function () {
            const msgText = ":tmi.twitch.tv HOSTTARGET #randers :- 0";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, hosttarget_1.HosttargetMessage);
            chai_1.assert.strictEqual(msg.channelName, "randers");
            chai_1.assert.isUndefined(msg.hostedChannelName);
            chai_1.assert.strictEqual(msg.viewerCount, 0);
            chai_1.assert.isTrue(msg.wasHostModeExited());
            chai_1.assert.isFalse(msg.wasHostModeEntered());
        });
        it("should require a second IRC parameter to be present", function () {
            const msgText = ":tmi.twitch.tv HOSTTARGET #randers";
            (0, helpers_spec_1.assertThrowsChain)(() => (0, twitch_message_1.parseTwitchMessage)(msgText), missing_data_error_1.MissingDataError, "Parameter at index 1 missing");
        });
    });
});
//# sourceMappingURL=hosttarget.spec.js.map