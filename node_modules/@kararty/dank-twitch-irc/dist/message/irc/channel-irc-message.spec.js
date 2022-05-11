"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helpers_spec_1 = require("../../helpers.spec");
const irc_message_1 = require("../parser/irc-message");
const missing_data_error_1 = require("../parser/missing-data-error");
const parse_error_1 = require("../parser/parse-error");
const channel_irc_message_1 = require("./channel-irc-message");
describe("./message/irc/channel-irc-message", function () {
    describe("#getIRCChannelName()", function () {
        it("should return valid channel names, trimmed of the leading # character", function () {
            chai_1.assert.strictEqual((0, channel_irc_message_1.getIRCChannelName)({ ircParameters: ["#pajlada"] }), "pajlada");
            chai_1.assert.strictEqual((0, channel_irc_message_1.getIRCChannelName)({ ircParameters: ["#a"] }), "a");
            chai_1.assert.strictEqual((0, channel_irc_message_1.getIRCChannelName)({ ircParameters: ["#a", "more arguments"] }), "a");
            chai_1.assert.strictEqual((0, channel_irc_message_1.getIRCChannelName)({ ircParameters: ["#a", "more", "arguments"] }), "a");
        });
        it("should handle chatroom channel ID normally", function () {
            const ircParameters = [
                "#chatrooms:11148817:85c31777-b181-46ab-8e08-73e4ecd7a386",
                "more",
                "arguments",
            ];
            chai_1.assert.strictEqual((0, channel_irc_message_1.getIRCChannelName)({ ircParameters }), "chatrooms:11148817:85c31777-b181-46ab-8e08-73e4ecd7a386");
        });
        it("should throw ParseError if no argument is present", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, channel_irc_message_1.getIRCChannelName)({ ircParameters: [] }), missing_data_error_1.MissingDataError, "Parameter at index 0 missing");
        });
        it("should throw ParseError on empty first argument", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, channel_irc_message_1.getIRCChannelName)({ ircParameters: [""] }), parse_error_1.ParseError, 'Received malformed IRC channel name ""');
        });
        it("should throw ParseError if argument does not begin with a # character", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, channel_irc_message_1.getIRCChannelName)({ ircParameters: ["abc"] }), parse_error_1.ParseError, 'Received malformed IRC channel name "abc"');
            (0, helpers_spec_1.assertThrowsChain)(() => (0, channel_irc_message_1.getIRCChannelName)({ ircParameters: ["pajlada"] }), parse_error_1.ParseError, 'Received malformed IRC channel name "pajlada"');
        });
        it("should throw ParseError on standalone # character", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, channel_irc_message_1.getIRCChannelName)({ ircParameters: ["#"] }), parse_error_1.ParseError, 'Received malformed IRC channel name "#"');
        });
    });
    describe("ChannelIRCMessage", function () {
        it("should parse argument 0 into #channelName", function () {
            const msg = new channel_irc_message_1.ChannelIRCMessage((0, irc_message_1.parseIRCMessage)("PRIVMSG #pajlada"));
            chai_1.assert.strictEqual(msg.channelName, "pajlada");
        });
        it("should throw ParseError on error parsing the channel name", function () {
            // some examples from above
            (0, helpers_spec_1.assertThrowsChain)(() => new channel_irc_message_1.ChannelIRCMessage((0, irc_message_1.parseIRCMessage)("PRIVMSG #")), parse_error_1.ParseError, 'Received malformed IRC channel name "#"');
            (0, helpers_spec_1.assertThrowsChain)(() => new channel_irc_message_1.ChannelIRCMessage((0, irc_message_1.parseIRCMessage)("PRIVMSG :")), parse_error_1.ParseError, 'Received malformed IRC channel name ""');
            (0, helpers_spec_1.assertThrowsChain)(() => new channel_irc_message_1.ChannelIRCMessage((0, irc_message_1.parseIRCMessage)("PRIVMSG")), missing_data_error_1.MissingDataError, "Parameter at index 0 missing");
        });
    });
});
//# sourceMappingURL=channel-irc-message.spec.js.map