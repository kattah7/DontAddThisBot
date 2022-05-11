"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../../parser/twitch-message");
const pong_1 = require("./pong");
describe("./message/twitch-types/connection/pong", function () {
    describe("PongMessage", function () {
        it("should be able to parse a real PONG message with no argument", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)(":tmi.twitch.tv PONG");
            chai_1.assert.instanceOf(msg, pong_1.PongMessage);
            chai_1.assert.strictEqual(msg.argument, undefined);
        });
        it("should be able to parse a real PONG message with argument", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)(":tmi.twitch.tv PONG tmi.twitch.tv :argument test");
            chai_1.assert.instanceOf(msg, pong_1.PongMessage);
            chai_1.assert.strictEqual(msg.argument, "argument test");
        });
    });
});
//# sourceMappingURL=pong.spec.js.map