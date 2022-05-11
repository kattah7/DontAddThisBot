"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const errors_1 = require("../client/errors");
const helpers_spec_1 = require("../helpers.spec");
const twitch_message_1 = require("../message/parser/twitch-message");
const request_capabilities_1 = require("./request-capabilities");
describe("./operations/request-capabilities", function () {
    describe("#acknowledgesCapabilities()", function () {
        it("should only return true if given capabilities are a subset of requested capabilities", function () {
            chai_1.assert.isTrue((0, request_capabilities_1.acknowledgesCapabilities)(["a", "b", "c"])((0, twitch_message_1.parseTwitchMessage)("CAP * ACK :a b c d")));
            chai_1.assert.isTrue((0, request_capabilities_1.acknowledgesCapabilities)(["a", "b", "c"])((0, twitch_message_1.parseTwitchMessage)("CAP * ACK :c b a")));
            chai_1.assert.isFalse((0, request_capabilities_1.acknowledgesCapabilities)(["a", "b", "c"])((0, twitch_message_1.parseTwitchMessage)("CAP * ACK :a b")));
        });
        it("should only consider the ACK subcommand", function () {
            chai_1.assert.isFalse((0, request_capabilities_1.acknowledgesCapabilities)(["a", "b", "c"])((0, twitch_message_1.parseTwitchMessage)("CAP * DEF :a b c")));
        });
    });
    describe("#deniedAnyCapability()", function () {
        it("should return true if any given capability is rejected", function () {
            chai_1.assert.isTrue((0, request_capabilities_1.deniedAnyCapability)(["a", "b", "c"])((0, twitch_message_1.parseTwitchMessage)("CAP * NAK :a b c")));
            chai_1.assert.isTrue((0, request_capabilities_1.deniedAnyCapability)(["a", "b", "c"])((0, twitch_message_1.parseTwitchMessage)("CAP * NAK :a")));
            chai_1.assert.isTrue((0, request_capabilities_1.deniedAnyCapability)(["a", "b", "c"])((0, twitch_message_1.parseTwitchMessage)("CAP * NAK :c")));
            chai_1.assert.isFalse((0, request_capabilities_1.deniedAnyCapability)(["a", "b", "c"])((0, twitch_message_1.parseTwitchMessage)("CAP * NAK :d")));
        });
        it("should only consider the NAK subcommand", function () {
            chai_1.assert.isFalse((0, request_capabilities_1.acknowledgesCapabilities)(["a", "b", "c"])((0, twitch_message_1.parseTwitchMessage)("CAP * DEF :a")));
        });
    });
    describe("#requestCapabilities()", function () {
        it("should send the correct wire command", function () {
            sinon.useFakeTimers();
            const { client, data } = (0, helpers_spec_1.fakeConnection)();
            (0, request_capabilities_1.requestCapabilities)(client, false);
            (0, request_capabilities_1.requestCapabilities)(client, true);
            chai_1.assert.deepStrictEqual(data, [
                "CAP REQ :twitch.tv/commands twitch.tv/tags\r\n",
                "CAP REQ :twitch.tv/commands twitch.tv/tags twitch.tv/membership\r\n",
            ]);
        });
        it("should resolve on CAP message acknowledging all capabilities", async function () {
            const { client, clientError, emitAndEnd } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, request_capabilities_1.requestCapabilities)(client, false);
            emitAndEnd(":tmi.twitch.tv CAP * ACK :twitch.tv/commands twitch.tv/tags");
            await promise;
            await clientError;
        });
        it("should reject on CAP message rejecting one or more of the requested capabilities", async function () {
            const { client, clientError, emitAndEnd } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, request_capabilities_1.requestCapabilities)(client, false);
            emitAndEnd(":tmi.twitch.tv CAP * ACK :twitch.tv/commands", ":tmi.twitch.tv CAP * NAK :twitch.tv/tags");
            await (0, helpers_spec_1.assertErrorChain)(promise, request_capabilities_1.CapabilitiesError, "Failed to request server capabilities twitch.tv/commands, " +
                "twitch.tv/tags: Bad response message: :tmi.twitch.tv CAP " +
                "* NAK :twitch.tv/tags", errors_1.MessageError, "Bad response message: :tmi.twitch.tv CAP * NAK :twitch.tv/tags");
            await (0, helpers_spec_1.assertErrorChain)(clientError, request_capabilities_1.CapabilitiesError, "Failed to request server capabilities twitch.tv/commands, " +
                "twitch.tv/tags: Bad response message: :tmi.twitch.tv CAP * " +
                "NAK :twitch.tv/tags", errors_1.MessageError, "Bad response message: :tmi.twitch.tv CAP * NAK :twitch.tv/tags");
        });
    });
    describe("CapabilitiesError", function () {
        it("should be instanceof ConnectionError", function () {
            chai_1.assert.instanceOf(new request_capabilities_1.CapabilitiesError(), errors_1.ConnectionError);
        });
        it("should not be instanceof ClientError", function () {
            chai_1.assert.notInstanceOf(new request_capabilities_1.CapabilitiesError(), errors_1.ClientError);
        });
    });
});
//# sourceMappingURL=request-capabilities.spec.js.map