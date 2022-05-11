"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../../parser/twitch-message");
const ping_1 = require("./ping");
describe("./message/twitch-types/connection/ping", function () {
    describe("PingMessage", function () {
        it("should be able to parse a real PING message with no argument", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)(":tmi.twitch.tv PING");
            chai_1.assert.instanceOf(msg, ping_1.PingMessage);
            chai_1.assert.strictEqual(msg.argument, undefined);
        });
        it("should be able to parse a real PING message with argument", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)(":tmi.twitch.tv PING tmi.twitch.tv :argument test");
            chai_1.assert.instanceOf(msg, ping_1.PingMessage);
            chai_1.assert.strictEqual(msg.argument, "argument test");
        });
    });
});
//# sourceMappingURL=ping.spec.js.map