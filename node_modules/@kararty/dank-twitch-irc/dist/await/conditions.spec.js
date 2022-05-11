"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../message/parser/twitch-message");
const conditions_1 = require("./conditions");
describe("./await/conditions", function () {
    describe("#matchingNotice()", function () {
        it("should not match anything that's not a NOTICE", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)("@msg-id=timeout_success :tmi.twitch.tv TEST #pajlada :WEEB123 has been timed out for 1 second.");
            chai_1.assert.isFalse((0, conditions_1.matchingNotice)("pajlada", ["timeout_success"])(msg));
        });
        it("should not match anything from the wrong channel", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)("@msg-id=timeout_success :tmi.twitch.tv NOTICE #forsen :WEEB123 has been timed out for 1 second.");
            chai_1.assert.isFalse((0, conditions_1.matchingNotice)("pajlada", ["timeout_success"])(msg));
        });
        it("should not match any non-matching notice IDs", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)("@msg-id=timeout_success :tmi.twitch.tv NOTICE #pajlada :WEEB123 has been timed out for 1 second.");
            chai_1.assert.isFalse((0, conditions_1.matchingNotice)("pajlada", ["timeout_success_lol"])(msg));
            chai_1.assert.isTrue((0, conditions_1.matchingNotice)("pajlada", ["timeout_success"])(msg));
        });
        it("should return false if msg-id is not present on the NOTICE message", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)(":tmi.twitch.tv NOTICE #pajlada :WEEB123 has been timed out for 1 second.");
            chai_1.assert.isFalse((0, conditions_1.matchingNotice)("pajlada", ["timeout_success"])(msg));
        });
        it("should return true for matching message", function () {
            const msg1 = (0, twitch_message_1.parseTwitchMessage)("@msg-id=timeout_success :tmi.twitch.tv NOTICE #pajlada :WEEB123 has been timed out for 1 second.");
            chai_1.assert.isTrue((0, conditions_1.matchingNotice)("pajlada", ["timeout_success", "lol"])(msg1));
            const msg2 = (0, twitch_message_1.parseTwitchMessage)("@msg-id=lol :tmi.twitch.tv NOTICE #pajlada :WEEB123 has been timed out for 1 second.");
            chai_1.assert.isTrue((0, conditions_1.matchingNotice)("pajlada", ["timeout_success", "lol"])(msg2));
        });
    });
});
//# sourceMappingURL=conditions.spec.js.map