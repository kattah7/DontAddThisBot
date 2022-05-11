"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../../parser/twitch-message");
const part_1 = require("./part");
describe("./message/twitch-types/membership/part", function () {
    describe("PartMessage", function () {
        it("should be able to parse a real PART message", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)(":justinfan11111!justinfan11111@justinfan11111.tmi.twitch.tv PART #pajlada");
            chai_1.assert.instanceOf(msg, part_1.PartMessage);
            chai_1.assert.strictEqual(msg.channelName, "pajlada");
            chai_1.assert.strictEqual(msg.partedUsername, "justinfan11111");
        });
    });
});
//# sourceMappingURL=part.spec.js.map