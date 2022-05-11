"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../parser/twitch-message");
const notice_1 = require("./notice");
describe("./message/twitch-types/notice", function () {
    describe("NoticeMessage", function () {
        it("should parse a normal NOTICE sent by the twitch server", function () {
            const msgText = "@msg-id=msg_banned :tmi.twitch.tv NOTICE #forsen " +
                ":You are permanently banned from talking in forsen.";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, notice_1.NoticeMessage);
            chai_1.assert.strictEqual(msg.channelName, "forsen");
            chai_1.assert.strictEqual(msg.messageText, "You are permanently banned from talking in forsen.");
            chai_1.assert.strictEqual(msg.messageID, "msg_banned");
        });
        it("should parse a NOTICE message received before successfuly login", function () {
            const msgText = ":tmi.twitch.tv NOTICE * :Improperly formatted auth";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, notice_1.NoticeMessage);
            chai_1.assert.isUndefined(msg.channelName);
            chai_1.assert.strictEqual(msg.messageText, "Improperly formatted auth");
            chai_1.assert.isUndefined(msg.messageID);
        });
    });
});
//# sourceMappingURL=notice.spec.js.map