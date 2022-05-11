"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const util_1 = require("util");
const helpers_spec_1 = require("../helpers.spec");
const badge_1 = require("../message/badge");
const twitch_message_1 = require("../message/parser/twitch-message");
const userstate_tracker_1 = require("./userstate-tracker");
describe("./mixins/userstate-tracker", function () {
    describe("UserstateTracker", function () {
        it("should set client.userstateTracker on the client when applied", function () {
            const { client } = (0, helpers_spec_1.fakeClient)(false);
            const userStateTracker = new userstate_tracker_1.UserStateTracker(client);
            chai_1.assert.isUndefined(client.userStateTracker);
            client.use(userStateTracker);
            chai_1.assert.strictEqual(client.userStateTracker, userStateTracker);
        });
        it("should save incoming USERSTATE messages", async function () {
            const { client, emitAndEnd } = (0, helpers_spec_1.fakeClient)();
            const userStateTracker = new userstate_tracker_1.UserStateTracker(client);
            client.use(userStateTracker);
            chai_1.assert.isUndefined(userStateTracker.getChannelState("randers"));
            const msgRaw = "@badge-info=subscriber/6;badges=broadcaster/1,subscriber/0;" +
                "color=#19E6E6;display-name=randers;emote-sets=0,42,237,954," +
                "1349,3188,4236,13653,15961,19194,22197,103040,164050,540476" +
                ",588170,669914,771847,1537468,1641460,1641461,1641462,30020" +
                "6307;mod=0;subscriber=1;user-type= :tmi.twitch.tv USERSTATE" +
                " #randers";
            emitAndEnd(msgRaw);
            const expectedState = (0, twitch_message_1.parseTwitchMessage)(msgRaw).extractUserState();
            await (0, util_1.promisify)(setImmediate);
            chai_1.assert.deepStrictEqual(userStateTracker.getChannelState("randers"), expectedState);
        });
        it("should emit newChannelState on new USERSTATE", async function () {
            const { client, emitAndEnd } = (0, helpers_spec_1.fakeClient)();
            const userStateTracker = new userstate_tracker_1.UserStateTracker(client);
            client.use(userStateTracker);
            const listenerCallback = sinon.fake();
            userStateTracker.on("newChannelState", listenerCallback);
            emitAndEnd("@badge-info=subscriber/6;badges=broadcaster/1,subscriber/0;" +
                "color=#19E6E6;display-name=randers;emote-sets=0,42,237,954," +
                "1349,3188,4236,13653,15961,19194,22197,103040,164050,540476" +
                ",588170,669914,771847,1537468,1641460,1641461,1641462,30020" +
                "6307;mod=0;subscriber=1;user-type= :tmi.twitch.tv USERSTATE" +
                " #randers");
            await (0, util_1.promisify)(setImmediate);
            (0, chai_1.assert)(listenerCallback.calledOnceWithExactly("randers", userStateTracker.getChannelState("randers")));
        });
        it("should save incoming GLOBALUSERSTATE messages", async function () {
            const { client, emitAndEnd } = (0, helpers_spec_1.fakeClient)();
            const userStateTracker = new userstate_tracker_1.UserStateTracker(client);
            client.use(userStateTracker);
            chai_1.assert.isUndefined(userStateTracker.globalState);
            chai_1.assert.isUndefined(userStateTracker.getGlobalState());
            const msgRaw = "@badge-info=;badges=;color=#19E6E6;display-name=randers;" +
                "emote-sets=0,42,237,954,1349,3188,4236,13653,15961,191" +
                "94,22197,103040,164050,540476,588170,669914,771849,151" +
                "1983,1641460,1641461,1641462,300206298;user-id=4028630" +
                "0;user-type= :tmi.twitch.tv GLOBALUSERSTATE";
            emitAndEnd(msgRaw);
            const expectedState = (0, twitch_message_1.parseTwitchMessage)(msgRaw).extractGlobalUserState();
            await (0, util_1.promisify)(setImmediate);
            chai_1.assert.deepStrictEqual(userStateTracker.globalState, expectedState);
            chai_1.assert.deepStrictEqual(userStateTracker.getGlobalState(), expectedState);
        });
        it("should emit newGlobalState on new GLOBALUSERSTATE", async function () {
            const { client, emitAndEnd } = (0, helpers_spec_1.fakeClient)();
            const userStateTracker = new userstate_tracker_1.UserStateTracker(client);
            client.use(userStateTracker);
            const listenerCallback = sinon.fake();
            userStateTracker.on("newGlobalState", listenerCallback);
            emitAndEnd("@badge-info=;badges=;color=#19E6E6;display-name=randers;" +
                "emote-sets=0,42,237,954,1349,3188,4236,13653,15961,191" +
                "94,22197,103040,164050,540476,588170,669914,771849,151" +
                "1983,1641460,1641461,1641462,300206298;user-id=4028630" +
                "0;user-type= :tmi.twitch.tv GLOBALUSERSTATE");
            await (0, util_1.promisify)(setImmediate);
            (0, chai_1.assert)(listenerCallback.calledOnceWithExactly(userStateTracker.getGlobalState()));
        });
        it("should update the userstate on PRIVMSG coming from the logged in user", async function () {
            const { client, emit, emitAndEnd } = (0, helpers_spec_1.fakeClient)();
            client.configuration.username = "randers";
            const userStateTracker = new userstate_tracker_1.UserStateTracker(client);
            client.use(userStateTracker);
            chai_1.assert.isUndefined(userStateTracker.getChannelState("randers"));
            const firstMsg = "@badge-info=subscriber/6;badges=broadcaster/" +
                "1,subscriber/0;color=#19E6E6;display-name=randers;emotes=;f" +
                "lags=;id=a9d86456-450b-4d74-8a0c-e067fb8a9d1d;mod=0;room-id" +
                "=40286300;subscriber=1;tmi-sent-ts=1566072586745;turbo=0;us" +
                "er-id=40286300;user-type= :randers!randers@randers.tmi.twit" +
                "ch.tv PRIVMSG #randers :asd";
            emit(firstMsg);
            await (0, util_1.promisify)(setImmediate);
            // PRIVMSG without a USERSTATE first does nothing
            chai_1.assert.isUndefined(userStateTracker.getChannelState("randers"));
            const secondMessage = "@badge-info=subscriber/6;badges=broadcaster/1,subscriber/0;" +
                "color=#19E6E6;display-name=randers;emote-sets=0,42,237,954," +
                "1349,3188,4236,13653,15961,19194,22197,103040,164050,540476" +
                ",588170,669914,771847,1537468,1641460,1641461,1641462,30020" +
                "6307;mod=0;subscriber=1;user-type= :tmi.twitch.tv USERSTATE" +
                " #randers";
            emit(secondMessage);
            await (0, util_1.promisify)(setImmediate);
            const secondMessageState = (0, twitch_message_1.parseTwitchMessage)(secondMessage).extractUserState();
            chai_1.assert.deepStrictEqual(userStateTracker.getChannelState("randers"), secondMessageState);
            // message from another user
            const thirdMsg = "@badge-info=subscriber/6;badges=broadcaster/1,subscriber/0" +
                ",glhf-pledge/1;color=#19E6E6;display-name=randers;emotes=" +
                ";flags=;id=e70cd84c-b8ed-4bc3-b1fc-b580f052a309;mod=0;room" +
                "-id=40286300;subscriber=1;tmi-sent-ts=1566072900564;turbo=" +
                "0;user-id=40286300;user-type= :randers00!randers00@randers" +
                "00.tmi.twitch.tv PRIVMSG #randers :asd2";
            emit(thirdMsg);
            await (0, util_1.promisify)(setImmediate);
            chai_1.assert.deepStrictEqual(userStateTracker.getChannelState("randers"), secondMessageState);
            // a new badge
            const fourthMsg = "@badge-info=subscriber/6;badges=broadcaster/1,subscriber/0" +
                ",glhf-pledge/1;color=#19E6E6;display-name=randers;emotes=" +
                ";flags=;id=e70cd84c-b8ed-4bc3-b1fc-b580f052a309;mod=0;room" +
                "-id=40286300;subscriber=1;tmi-sent-ts=1566072900564;turbo=" +
                "0;user-id=40286300;user-type= :randers!randers@randers.tmi" +
                ".twitch.tv PRIVMSG #randers :asd2";
            emitAndEnd(fourthMsg);
            await (0, util_1.promisify)(setImmediate);
            chai_1.assert.deepStrictEqual(userStateTracker.getChannelState("randers").badges, [
                new badge_1.TwitchBadge("broadcaster", "1"),
                new badge_1.TwitchBadge("subscriber", "0"),
                new badge_1.TwitchBadge("glhf-pledge", "1"),
            ]);
            chai_1.assert.deepStrictEqual(userStateTracker.getChannelState("randers").badgesRaw, "broadcaster/1,subscriber/0,glhf-pledge/1");
            client.close();
        });
    });
});
//# sourceMappingURL=userstate-tracker.spec.js.map