"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const errors_1 = require("../client/errors");
const helpers_spec_1 = require("../helpers.spec");
const say_1 = require("./say");
describe("./operations/say", function () {
    describe("#removeCommands()", function () {
        it("should remove all twitch commands", function () {
            chai_1.assert.strictEqual((0, say_1.removeCommands)("/me hi"), "/ /me hi");
            chai_1.assert.strictEqual((0, say_1.removeCommands)(".me hi"), "/ .me hi");
            chai_1.assert.strictEqual((0, say_1.removeCommands)("/timeout weeb123 5"), "/ /timeout weeb123 5");
        });
        it("should not prepend a slash to other messages", function () {
            chai_1.assert.strictEqual((0, say_1.removeCommands)(""), "");
            chai_1.assert.strictEqual((0, say_1.removeCommands)("\\me hi"), "\\me hi");
            chai_1.assert.strictEqual((0, say_1.removeCommands)("hello world!"), "hello world!");
        });
    });
    describe("SayError", function () {
        it("should not be instanceof ConnectionError", function () {
            chai_1.assert.notInstanceOf(new say_1.SayError("pajlada", "test", true), errors_1.ConnectionError);
        });
        it("should not be instanceof ClientError", function () {
            chai_1.assert.notInstanceOf(new say_1.SayError("pajlada", "test", true), errors_1.ClientError);
        });
    });
    describe("#say()", function () {
        it("should send the correct wire command", function () {
            sinon.useFakeTimers();
            const { data, client } = (0, helpers_spec_1.fakeConnection)();
            (0, say_1.say)(client, "pajlada", "/test test abc KKona");
            chai_1.assert.deepStrictEqual(data, [
                "PRIVMSG #pajlada :/ /test test abc KKona\r\n",
            ]);
        });
        it("should resolve on USERSTATE", async function () {
            const { client, clientError, emitAndEnd } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, say_1.say)(client, "pajlada", "/test test abc KKona");
            const userstateResponse = "@badge-info=;badges=;color=;display-name=justinfan12345;emote-sets=0;mod=0;" +
                "subscriber=0;user-type= :tmi.twitch.tv USERSTATE #pajlada";
            emitAndEnd(userstateResponse);
            const response = await promise;
            chai_1.assert.strictEqual(response.rawSource, userstateResponse);
            await clientError;
        });
        it("should reject on msg_channel_suspended", async function () {
            const { client, clientError, emitAndEnd } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, say_1.say)(client, "pajlada", "abc def");
            emitAndEnd("@msg-id=msg_channel_suspended :tmi.twitch.tv NOTICE" +
                " #pajlada :This channel has been suspended.");
            await (0, helpers_spec_1.assertErrorChain)(promise, say_1.SayError, "Failed to say [#pajlada]: abc def: Bad response message: " +
                "@msg-id=msg_channel_suspended :tmi.twitch.tv NOTICE #pajlad" +
                "a :This channel has been suspended.", errors_1.MessageError, "Bad response message: @msg-id=msg_channel_suspended :tmi.twit" +
                "ch.tv NOTICE #pajlada :This channel has been suspended.");
            await (0, helpers_spec_1.assertErrorChain)(clientError, say_1.SayError, "Failed to say [#pajlada]: abc def: Bad response message: @msg" +
                "-id=msg_channel_suspended :tmi.twitch.tv NOTICE #pajlada :Th" +
                "is channel has been suspended.", errors_1.MessageError, "Bad response message: @msg-id=msg_channel_suspended :tmi.twitc" +
                "h.tv NOTICE #pajlada :This channel has been suspended.");
        });
    });
    describe("#me()", function () {
        it("should send the correct wire command", function () {
            sinon.useFakeTimers();
            const { data, client } = (0, helpers_spec_1.fakeConnection)();
            (0, say_1.me)(client, "pajlada", "test abc KKona");
            chai_1.assert.deepStrictEqual(data, [
                "PRIVMSG #pajlada :/me test abc KKona\r\n",
            ]);
        });
        it("should resolve on USERSTATE", async function () {
            const { client, clientError, emitAndEnd } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, say_1.me)(client, "pajlada", "test test abc KKona");
            const userstateResponse = "@badge-info=;badges=;color=;display-name=justinfan12345;emote-sets=0;mod=0;" +
                "subscriber=0;user-type= :tmi.twitch.tv USERSTATE #pajlada";
            emitAndEnd(userstateResponse);
            const response = await promise;
            chai_1.assert.strictEqual(response.rawSource, userstateResponse);
            await clientError;
        });
        it("should reject on msg_channel_suspended", async function () {
            const { client, clientError, emitAndEnd } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, say_1.me)(client, "pajlada", "abc def");
            emitAndEnd("@msg-id=msg_channel_suspended :tmi.twitch.tv NOTICE" +
                " #pajlada :This channel has been suspended.");
            await (0, helpers_spec_1.assertErrorChain)(promise, say_1.SayError, "Failed to say [#pajlada]: /me abc def: Bad response message: " +
                "@msg-id=msg_channel_suspended :tmi.twitch.tv NOTICE #pajlad" +
                "a :This channel has been suspended.", errors_1.MessageError, "Bad response message: @msg-id=msg_channel_suspended :tmi.twit" +
                "ch.tv NOTICE #pajlada :This channel has been suspended.");
            await (0, helpers_spec_1.assertErrorChain)(clientError, say_1.SayError, "Failed to say [#pajlada]: /me abc def: Bad response message: @msg" +
                "-id=msg_channel_suspended :tmi.twitch.tv NOTICE #pajlada :Th" +
                "is channel has been suspended.", errors_1.MessageError, "Bad response message: @msg-id=msg_channel_suspended :tmi.twitc" +
                "h.tv NOTICE #pajlada :This channel has been suspended.");
        });
    });
});
//# sourceMappingURL=say.spec.js.map