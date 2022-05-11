"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../parser/twitch-message");
const cap_1 = require("./cap");
describe("./message/twitch-types/cap", function () {
    describe("CapMessage", function () {
        it("should parse a single CAP ACK message", function () {
            const msgText = ":tmi.twitch.tv CAP * ACK :twitch.tv/commands";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, cap_1.CapMessage);
            chai_1.assert.strictEqual(msg.subCommand, "ACK");
            chai_1.assert.deepStrictEqual(msg.capabilities, ["twitch.tv/commands"]);
        });
        it("should parse multiple capabilities CAP ACK message", function () {
            const msgText = ":tmi.twitch.tv CAP * ACK :twitch.tv/commands twitch.tv/tags twitch.tv/membership";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, cap_1.CapMessage);
            chai_1.assert.strictEqual(msg.subCommand, "ACK");
            chai_1.assert.deepStrictEqual(msg.capabilities, [
                "twitch.tv/commands",
                "twitch.tv/tags",
                "twitch.tv/membership",
            ]);
        });
        it("should parse a CAP NAK message", function () {
            const msgText = ":tmi.twitch.tv CAP * NAK :invalid twitch.tv/invalid";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, cap_1.CapMessage);
            chai_1.assert.strictEqual(msg.subCommand, "NAK");
            chai_1.assert.deepStrictEqual(msg.capabilities, [
                "invalid",
                "twitch.tv/invalid",
            ]);
        });
        it("should parse a CAP LS message", function () {
            const msgText = ":tmi.twitch.tv CAP * LS :twitch.tv/tags twitch.tv/commands twitch.tv/membership";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, cap_1.CapMessage);
            chai_1.assert.strictEqual(msg.subCommand, "LS");
            chai_1.assert.deepStrictEqual(msg.capabilities, [
                "twitch.tv/tags",
                "twitch.tv/commands",
                "twitch.tv/membership",
            ]);
        });
    });
});
//# sourceMappingURL=cap.spec.js.map