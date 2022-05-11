"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const badges_1 = require("../badges");
const emote_1 = require("../emote");
const twitch_message_1 = require("../parser/twitch-message");
const whisper_1 = require("./whisper");
describe("./message/twitch-types/whisper", function () {
    describe("WhisperMessage", function () {
        it("should be able to parse a real WHISPER message correctly", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)("@badges=;color=#2E8B57;display-name=pajbot;emotes=25:7-11;message-id=" +
                "2034;thread-id=40286300_82008718;turbo=0;user-id=82008718;user-type= " +
                ":pajbot!pajbot@pajbot.tmi.twitch.tv WHISPER randers :Riftey Kappa");
            chai_1.assert.instanceOf(msg, whisper_1.WhisperMessage);
            chai_1.assert.strictEqual(msg.messageText, "Riftey Kappa");
            chai_1.assert.strictEqual(msg.senderUsername, "pajbot");
            chai_1.assert.strictEqual(msg.senderUserID, "82008718");
            chai_1.assert.strictEqual(msg.displayName, "pajbot");
            chai_1.assert.strictEqual(msg.recipientUsername, "randers");
            chai_1.assert.deepStrictEqual(msg.badges, new badges_1.TwitchBadgesList());
            chai_1.assert.strictEqual(msg.badgesRaw, "");
            chai_1.assert.deepStrictEqual(msg.color, {
                r: 0x2e,
                g: 0x8b,
                b: 0x57,
            });
            chai_1.assert.strictEqual(msg.colorRaw, "#2E8B57");
            chai_1.assert.deepStrictEqual(msg.emotes, [
                new emote_1.TwitchEmote("25", 7, 12, "Kappa"),
            ]);
            chai_1.assert.strictEqual(msg.emotesRaw, "25:7-11");
            chai_1.assert.strictEqual(msg.messageID, "2034");
            chai_1.assert.strictEqual(msg.threadID, "40286300_82008718");
        });
        it("trims spaces at the end of display names", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)("@badges=;color=#2E8B57;display-name=pajbot\\s;emotes=25:7-11;message-id=" +
                "2034;thread-id=40286300_82008718;turbo=0;user-id=82008718;user-type= " +
                ":pajbot!pajbot@pajbot.tmi.twitch.tv WHISPER randers :Riftey Kappa");
            chai_1.assert.strictEqual(msg.displayName, "pajbot");
        });
    });
});
//# sourceMappingURL=whisper.spec.js.map