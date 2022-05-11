"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../parser/twitch-message");
const clearmsg_1 = require("./clearmsg");
describe("./message/twitch-types/clearmsg", function () {
    describe("ClearmsgMessage", function () {
        it("should be able to parse a real CLEARMSG message from twitch", function () {
            const msgText = "@login=supibot;room-id=;target-msg-id=25fd76d9-4731-4907-978e-a391134ebd67;" +
                "tmi-sent-ts=-6795364578871 :tmi.twitch.tv CLEARMSG #randers :Pong! Uptime: 6h, " +
                "15m; Temperature: 54.8°C; Latency to TMI: 183ms; Commands used: 795";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.strictEqual(Object.getPrototypeOf(msg), clearmsg_1.ClearmsgMessage.prototype);
            chai_1.assert.strictEqual(msg.channelName, "randers");
            chai_1.assert.strictEqual(msg.targetUsername, "supibot");
            chai_1.assert.strictEqual(msg.targetMessageID, "25fd76d9-4731-4907-978e-a391134ebd67");
            chai_1.assert.strictEqual(msg.targetMessageContent, "Pong! Uptime: 6h, 15m; Temperature: 54.8°C; " +
                "Latency to TMI: 183ms; Commands used: 795");
        });
    });
});
//# sourceMappingURL=clearmsg.spec.js.map