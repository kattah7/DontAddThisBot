"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const util_1 = require("util");
const helpers_spec_1 = require("../helpers.spec");
const roomstate_tracker_1 = require("./roomstate-tracker");
describe("./mixins/roomstate-tracker", function () {
    describe("RoomstateTracker", function () {
        it("should set client.roomstateTracker on the client when applied", function () {
            const { client } = (0, helpers_spec_1.fakeClient)(false);
            const roomStateTracker = new roomstate_tracker_1.RoomStateTracker();
            chai_1.assert.isUndefined(client.roomStateTracker);
            client.use(roomStateTracker);
            chai_1.assert.strictEqual(client.roomStateTracker, roomStateTracker);
        });
        it("should save/update incoming ROOMSTATE messages", async function () {
            const { client, emit, emitAndEnd } = (0, helpers_spec_1.fakeClient)();
            const roomStateTracker = new roomstate_tracker_1.RoomStateTracker();
            client.use(roomStateTracker);
            chai_1.assert.isUndefined(roomStateTracker.getChannelState("randers"));
            emit("@emote-only=0;followers-only=-1;r9k=0;rituals=0;room-id=40286300;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #randers");
            await (0, util_1.promisify)(setImmediate);
            chai_1.assert.deepStrictEqual(roomStateTracker.getChannelState("randers"), {
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
            // enable r9k (full roomstate)
            emit("@emote-only=0;followers-only=-1;r9k=1;rituals=0;room-id=40286300;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #randers");
            await (0, util_1.promisify)(setImmediate);
            chai_1.assert.deepStrictEqual(roomStateTracker.getChannelState("randers"), {
                emoteOnly: false,
                emoteOnlyRaw: "0",
                followersOnlyDuration: -1,
                followersOnlyDurationRaw: "-1",
                r9k: true,
                r9kRaw: "1",
                slowModeDuration: 0,
                slowModeDurationRaw: "0",
                subscribersOnly: false,
                subscribersOnlyRaw: "0",
            });
            // enable sub mode (partial roomstate)
            emitAndEnd("@room-id=40286300;subs-only=1 :tmi.twitch.tv ROOMSTATE #randers");
            await (0, util_1.promisify)(setImmediate);
            chai_1.assert.deepStrictEqual(roomStateTracker.getChannelState("randers"), {
                emoteOnly: false,
                emoteOnlyRaw: "0",
                followersOnlyDuration: -1,
                followersOnlyDurationRaw: "-1",
                r9k: true,
                r9kRaw: "1",
                slowModeDuration: 0,
                slowModeDurationRaw: "0",
                subscribersOnly: true,
                subscribersOnlyRaw: "1",
            });
        });
        it("should ignore partial ROOMSTATE messages before the first full ROOMSTATE message", async function () {
            const { client, emitAndEnd } = (0, helpers_spec_1.fakeClient)();
            const roomStateTracker = new roomstate_tracker_1.RoomStateTracker();
            client.use(roomStateTracker);
            chai_1.assert.isUndefined(roomStateTracker.getChannelState("randers"));
            emitAndEnd("@room-id=40286300;subs-only=1 :tmi.twitch.tv ROOMSTATE #randers");
            await (0, util_1.promisify)(setImmediate);
            chai_1.assert.isUndefined(roomStateTracker.getChannelState("randers"));
        });
        it("should emit newChannelState on new roomstate", async function () {
            const { client, emit } = (0, helpers_spec_1.fakeClient)();
            const roomStateTracker = new roomstate_tracker_1.RoomStateTracker();
            client.use(roomStateTracker);
            const listenerCallback = sinon.fake();
            roomStateTracker.on("newChannelState", listenerCallback);
            emit("@emote-only=0;followers-only=-1;r9k=0;rituals=0;room-id=40286300;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #randers");
            client.destroy();
            await (0, util_1.promisify)(setImmediate);
            (0, chai_1.assert)(listenerCallback.calledOnceWithExactly("randers", roomStateTracker.getChannelState("randers")));
        });
        it("should emit newChannelState on updated roomstate", async function () {
            const { client, emit, emitAndEnd } = (0, helpers_spec_1.fakeClient)();
            const roomStateTracker = new roomstate_tracker_1.RoomStateTracker();
            client.use(roomStateTracker);
            emit("@emote-only=0;followers-only=-1;r9k=0;rituals=0;room-id=40286300;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #randers");
            await (0, util_1.promisify)(setImmediate);
            const listenerCallback = sinon.fake();
            roomStateTracker.on("newChannelState", listenerCallback);
            emitAndEnd("@room-id=40286300;subs-only=1 :tmi.twitch.tv ROOMSTATE #randers");
            await (0, util_1.promisify)(setImmediate);
            (0, chai_1.assert)(listenerCallback.calledOnceWithExactly("randers", roomStateTracker.getChannelState("randers")));
        });
    });
});
//# sourceMappingURL=roomstate-tracker.spec.js.map