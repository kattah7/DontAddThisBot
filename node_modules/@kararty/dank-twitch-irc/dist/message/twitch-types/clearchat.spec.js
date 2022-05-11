"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../parser/twitch-message");
const clearchat_1 = require("./clearchat");
describe("./message/twitch-types/clearchat", function () {
    describe("ClearchatMessage", function () {
        it("should be able to parse a real CLEARCHAT timeout message from twitch", function () {
            const msgText = "@ban-duration=600;room-id=40286300;target-user-id=70948394;" +
                "tmi-sent-ts=1563051113633 :tmi.twitch.tv CLEARCHAT #randers :weeb123";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, clearchat_1.ClearchatMessage);
            chai_1.assert.strictEqual(msg.channelName, "randers");
            chai_1.assert.strictEqual(msg.targetUsername, "weeb123");
            chai_1.assert.strictEqual(msg.banDuration, 600);
            chai_1.assert.isFalse(msg.wasChatCleared());
            chai_1.assert.isTrue(msg.isTimeout());
            chai_1.assert.isFalse(msg.isPermaban());
        });
        it("should be able to parse a real CLEARCHAT ban message from twitch", function () {
            const msgText = "@room-id=40286300;target-user-id=70948394;tmi-sent-ts=1563051758128 " +
                ":tmi.twitch.tv CLEARCHAT #randers :weeb123";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, clearchat_1.ClearchatMessage);
            chai_1.assert.strictEqual(msg.channelName, "randers");
            chai_1.assert.strictEqual(msg.targetUsername, "weeb123");
            chai_1.assert.isUndefined(msg.banDuration);
            chai_1.assert.isFalse(msg.wasChatCleared());
            chai_1.assert.isFalse(msg.isTimeout());
            chai_1.assert.isTrue(msg.isPermaban());
        });
        it("should be able to parse a real CLEARCHAT chat clear message from twitch", function () {
            const msgText = "@room-id=40286300;tmi-sent-ts=1563051778390 :tmi.twitch.tv CLEARCHAT #randers";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, clearchat_1.ClearchatMessage);
            chai_1.assert.strictEqual(msg.channelName, "randers");
            chai_1.assert.isUndefined(msg.targetUsername);
            chai_1.assert.isUndefined(msg.banDuration);
            chai_1.assert.isTrue(msg.wasChatCleared());
            chai_1.assert.isFalse(msg.isTimeout());
            chai_1.assert.isFalse(msg.isPermaban());
        });
    });
});
//# sourceMappingURL=clearchat.spec.js.map