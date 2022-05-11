"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const badges_1 = require("../badges");
const twitch_message_1 = require("../parser/twitch-message");
const userstate_1 = require("./userstate");
describe("./message/twitch-types/userstate", function () {
    describe("UserstateMessage", function () {
        it("should be able to parse a real userstate message", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)("@badge-info=;badges=;color=#FF0000;" +
                "display-name=zwb3_pyramids;emote-sets=0;mod=0;subscriber=0;user-type=" +
                " :tmi.twitch.tv USERSTATE #randers");
            chai_1.assert.instanceOf(msg, userstate_1.UserstateMessage);
            chai_1.assert.strictEqual(msg.channelName, "randers");
            chai_1.assert.deepStrictEqual(msg.badgeInfo, new badges_1.TwitchBadgesList());
            chai_1.assert.strictEqual(msg.badgeInfoRaw, "");
            chai_1.assert.deepStrictEqual(msg.badges, new badges_1.TwitchBadgesList());
            chai_1.assert.strictEqual(msg.badgesRaw, "");
            chai_1.assert.deepStrictEqual(msg.color, {
                r: 0xff,
                g: 0x00,
                b: 0x00,
            });
            chai_1.assert.strictEqual(msg.colorRaw, "#FF0000");
            chai_1.assert.strictEqual(msg.displayName, "zwb3_pyramids");
            chai_1.assert.deepStrictEqual(msg.emoteSets, ["0"]);
            chai_1.assert.strictEqual(msg.emoteSetsRaw, "0");
            chai_1.assert.strictEqual(msg.isMod, false);
            chai_1.assert.strictEqual(msg.isModRaw, "0");
        });
        it("should extract the correct values with extractUserState()", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)("@badge-info=;badges=;color=#FF0000;" +
                "display-name=zwb3_pyramids;emote-sets=0;mod=0;subscriber=0;user-type=" +
                " :tmi.twitch.tv USERSTATE #randers");
            chai_1.assert.deepStrictEqual(msg.extractUserState(), {
                badgeInfo: new badges_1.TwitchBadgesList(),
                badgeInfoRaw: "",
                badges: new badges_1.TwitchBadgesList(),
                badgesRaw: "",
                color: { r: 0xff, g: 0x00, b: 0x00 },
                colorRaw: "#FF0000",
                displayName: "zwb3_pyramids",
                emoteSets: ["0"],
                emoteSetsRaw: "0",
                isMod: false,
                isModRaw: "0",
            });
        });
        it("trims spaces at the end of display names", function () {
            const msg = (0, twitch_message_1.parseTwitchMessage)("@badge-info=;badges=;color=#FF0000;" +
                "display-name=zwb3_pyramids\\s;emote-sets=0;mod=0;subscriber=0;user-type=" +
                " :tmi.twitch.tv USERSTATE #randers");
            chai_1.assert.strictEqual(msg.displayName, "zwb3_pyramids");
        });
    });
});
//# sourceMappingURL=userstate.spec.js.map