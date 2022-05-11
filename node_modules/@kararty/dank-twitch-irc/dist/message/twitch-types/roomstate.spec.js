"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const twitch_message_1 = require("../parser/twitch-message");
const roomstate_1 = require("./roomstate");
describe("./message/twitch-types/roomstate", function () {
    describe("#hasAllStateTags()", function () {
        it("should return true if all properties are present", function () {
            chai_1.assert.isTrue((0, roomstate_1.hasAllStateTags)({
                emoteOnly: true,
                emoteOnlyRaw: "1",
                followersOnlyDuration: -1,
                followersOnlyDurationRaw: "-1",
                r9k: false,
                r9kRaw: "0",
                slowModeDuration: 0,
                slowModeDurationRaw: "0",
                subscribersOnly: false,
                subscribersOnlyRaw: "0",
            }));
        });
        it("should return false if one property is absent", function () {
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)({
                followersOnlyDuration: -1,
                followersOnlyDurationRaw: "-1",
                r9k: false,
                r9kRaw: "0",
                slowModeDuration: 0,
                slowModeDurationRaw: "0",
                subscribersOnly: false,
                subscribersOnlyRaw: "0",
            }));
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)({
                emoteOnly: true,
                emoteOnlyRaw: "1",
                r9k: false,
                r9kRaw: "0",
                slowModeDuration: 0,
                slowModeDurationRaw: "0",
                subscribersOnly: false,
                subscribersOnlyRaw: "0",
            }));
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)({
                emoteOnly: true,
                emoteOnlyRaw: "1",
                followersOnlyDuration: -1,
                followersOnlyDurationRaw: "-1",
                slowModeDuration: 0,
                slowModeDurationRaw: "0",
                subscribersOnly: false,
                subscribersOnlyRaw: "0",
            }));
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)({
                emoteOnly: true,
                emoteOnlyRaw: "1",
                followersOnlyDuration: -1,
                followersOnlyDurationRaw: "-1",
                r9k: false,
                r9kRaw: "0",
                subscribersOnly: false,
                subscribersOnlyRaw: "0",
            }));
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)({
                emoteOnly: true,
                emoteOnlyRaw: "1",
                followersOnlyDuration: -1,
                followersOnlyDurationRaw: "-1",
                r9k: false,
                r9kRaw: "0",
                slowModeDuration: 0,
                slowModeDurationRaw: "0",
            }));
        });
        it("should return false if only one property is present", function () {
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)({
                emoteOnly: true,
                emoteOnlyRaw: "1",
            }));
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)({
                followersOnlyDuration: -1,
                followersOnlyDurationRaw: "-1",
            }));
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)({
                r9k: false,
                r9kRaw: "0",
            }));
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)({
                slowModeDuration: 0,
                slowModeDurationRaw: "0",
            }));
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)({
                subscribersOnly: false,
                subscribersOnlyRaw: "0",
            }));
        });
    });
    describe("RoomstateMessage", function () {
        it("should be able to parse a fully-populated ROOMSTATE message", function () {
            const msgText = "@emote-only=0;followers-only=-1;r9k=0;rituals=0;room-id=40286300;" +
                "slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #randers";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, roomstate_1.RoomstateMessage);
            chai_1.assert.strictEqual(msg.channelName, "randers");
            chai_1.assert.strictEqual(msg.channelID, "40286300");
            chai_1.assert.strictEqual(msg.emoteOnly, false);
            chai_1.assert.strictEqual(msg.emoteOnlyRaw, "0");
            chai_1.assert.strictEqual(msg.followersOnlyDuration, -1);
            chai_1.assert.strictEqual(msg.followersOnlyDurationRaw, "-1");
            chai_1.assert.strictEqual(msg.r9k, false);
            chai_1.assert.strictEqual(msg.r9kRaw, "0");
            chai_1.assert.strictEqual(msg.slowModeDuration, 0);
            chai_1.assert.strictEqual(msg.slowModeDurationRaw, "0");
            chai_1.assert.strictEqual(msg.subscribersOnly, false);
            chai_1.assert.strictEqual(msg.subscribersOnlyRaw, "0");
            chai_1.assert.deepStrictEqual(msg.extractRoomState(), {
                emoteOnly: false,
                emoteOnlyRaw: "0",
                followersOnlyDuration: -1,
                followersOnlyDurationRaw: "-1",
                r9k: false,
                r9kRaw: "0",
                slowModeDuration: 0,
                slowModeDurationRaw: "0",
                subscribersOnly: false,
                subscribersOnlyRaw: "0",
            });
            chai_1.assert.isTrue((0, roomstate_1.hasAllStateTags)(msg.extractRoomState()));
        });
        it("should be able to parse a single property change ROOMSTATE message", function () {
            const msgText = "@emote-only=1;room-id=40286300 :tmi.twitch.tv ROOMSTATE #randers";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, roomstate_1.RoomstateMessage);
            chai_1.assert.strictEqual(msg.channelName, "randers");
            chai_1.assert.strictEqual(msg.channelID, "40286300");
            chai_1.assert.strictEqual(msg.emoteOnly, true);
            chai_1.assert.strictEqual(msg.emoteOnlyRaw, "1");
            chai_1.assert.isUndefined(msg.followersOnlyDuration);
            chai_1.assert.isUndefined(msg.followersOnlyDurationRaw);
            chai_1.assert.isUndefined(msg.r9k);
            chai_1.assert.isUndefined(msg.r9kRaw);
            chai_1.assert.isUndefined(msg.slowModeDuration);
            chai_1.assert.isUndefined(msg.slowModeDurationRaw);
            chai_1.assert.isUndefined(msg.subscribersOnly);
            chai_1.assert.isUndefined(msg.subscribersOnlyRaw);
            chai_1.assert.deepStrictEqual(msg.extractRoomState(), {
                emoteOnly: true,
                emoteOnlyRaw: "1",
            });
            chai_1.assert.isFalse((0, roomstate_1.hasAllStateTags)(msg.extractRoomState()));
        });
    });
});
//# sourceMappingURL=roomstate.spec.js.map