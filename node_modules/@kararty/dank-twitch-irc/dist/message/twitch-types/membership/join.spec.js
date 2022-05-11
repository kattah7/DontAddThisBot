"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../../parser/twitch-message");
const join_1 = require("./join");
describe("./message/twitch-types/membership/join", function () {
    describe("JoinMessage", function () {
        it("should be able to parse a real JOIN message", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)(":justinfan11111!justinfan11111@justinfan11111.tmi.twitch.tv JOIN #pajlada");
            chai_1.assert.instanceOf(msg, join_1.JoinMessage);
            chai_1.assert.strictEqual(msg.channelName, "pajlada");
            chai_1.assert.strictEqual(msg.joinedUsername, "justinfan11111");
        });
    });
});
//# sourceMappingURL=join.spec.js.map