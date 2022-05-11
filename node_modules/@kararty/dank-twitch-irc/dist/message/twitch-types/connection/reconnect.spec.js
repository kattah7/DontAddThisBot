"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../../parser/twitch-message");
const reconnect_1 = require("./reconnect");
describe("./message/twitch-types/connection/reconnect", function () {
    describe("ReconnectMessage", function () {
        it("should be able to parse a real RECONNECT message", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)(":tmi.twitch.tv RECONNECT");
            chai_1.assert.instanceOf(msg, reconnect_1.ReconnectMessage);
        });
    });
});
//# sourceMappingURL=reconnect.spec.js.map