"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const timeout_error_1 = require("../await/timeout-error");
const errors_1 = require("../client/errors");
const helpers_spec_1 = require("../helpers.spec");
const twitch_message_1 = require("../message/parser/twitch-message");
const join_1 = require("./join");
describe("./operations/join", function () {
    describe("#joinNotingToDo()", function () {
        it("should be false if channel is not joined or wanted", function () {
            // typical situation where channel is not joined and is now being
            // joined.
            const { client } = (0, helpers_spec_1.fakeConnection)();
            client.wantedChannels.clear();
            client.joinedChannels.clear();
            chai_1.assert.isFalse((0, join_1.joinNothingToDo)(client, "pajlada"));
        });
        it("should be false if channel is joined but not wanted", function () {
            // situation where we are still joined but don't want to be, e.g.
            // a part is in progress, but we can already begin re-joining
            const { client } = (0, helpers_spec_1.fakeConnection)();
            client.wantedChannels.clear();
            client.joinedChannels.clear();
            client.joinedChannels.add("pajlada");
            chai_1.assert.isFalse((0, join_1.joinNothingToDo)(client, "pajlada"));
        });
        it("should be false if channel is not joined but wanted", function () {
            // e.g. previously failed JOIN, allow the join to be retried
            const { client } = (0, helpers_spec_1.fakeConnection)();
            client.wantedChannels.clear();
            client.wantedChannels.add("pajlada");
            client.joinedChannels.clear();
            chai_1.assert.isFalse((0, join_1.joinNothingToDo)(client, "pajlada"));
        });
        it("should be true if channel is joined and wanted", function () {
            // channel is both joined and supposed to be joined, only in
            // this case is nothing to do.
            const { client } = (0, helpers_spec_1.fakeConnection)();
            client.wantedChannels.clear();
            client.wantedChannels.add("pajlada");
            client.joinedChannels.clear();
            chai_1.assert.isFalse((0, join_1.joinNothingToDo)(client, "pajlada"));
        });
    });
    describe("#joinChannel()", function () {
        it("sends the correct wire command", function () {
            sinon.useFakeTimers(); // prevent the promise timing out
            const { data, client } = (0, helpers_spec_1.fakeConnection)();
            (0, join_1.joinChannel)(client, "pajlada");
            chai_1.assert.deepEqual(data, ["JOIN #pajlada\r\n"]);
        });
        it("does nothing if channel is joined and wanted", function () {
            sinon.useFakeTimers(); // prevent the promise timing out
            const { data, client } = (0, helpers_spec_1.fakeConnection)();
            client.wantedChannels.add("pajlada");
            client.joinedChannels.add("pajlada");
            (0, join_1.joinChannel)(client, "pajlada");
            chai_1.assert.deepEqual(data, []);
        });
        it("sends the command if channel is not in joinedChannels but in wantedChannels", function () {
            sinon.useFakeTimers(); // prevent the promise timing out
            const { data, client } = (0, helpers_spec_1.fakeConnection)();
            client.wantedChannels.add("pajlada");
            (0, join_1.joinChannel)(client, "pajlada");
            chai_1.assert.deepEqual(data, ["JOIN #pajlada\r\n"]);
        });
        it("resolves on incoming JOIN", async function () {
            const { emitAndEnd, client, clientError } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, join_1.joinChannel)(client, "pajlada");
            emitAndEnd(":justinfan12345!justinfan12345@justinfan12345.tmi.twitch.tv JOIN #pajlada", "@emote-only=0;followers-only=5;r9k=0;rituals=0;room-id=11148817;slow=0;subs-only=0 " +
                ":tmi.twitch.tv ROOMSTATE #pajlada", ":justinfan12345.tmi.twitch.tv 353 justinfan12345 = #pajlada :justinfan12345", ":justinfan12345.tmi.twitch.tv 366 justinfan12345 #pajlada :End of /NAMES list");
            chai_1.assert.deepStrictEqual(await promise, (0, twitch_message_1.parseTwitchMessage)(":justinfan12345!justinfan12345@justinfan12345.tmi.twitch.tv JOIN #pajlada"));
            await clientError;
        });
        it("adds channel to channel list on success", async function () {
            const { emitAndEnd, client, clientError } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, join_1.joinChannel)(client, "pajlada");
            emitAndEnd(":justinfan12345!justinfan12345@justinfan12345.tmi.twitch.tv JOIN #pajlada", "@emote-only=0;followers-only=5;r9k=0;rituals=0;room-id=11148817;slow=0;subs-only=0 " +
                ":tmi.twitch.tv ROOMSTATE #pajlada", ":justinfan12345.tmi.twitch.tv 353 justinfan12345 = #pajlada :justinfan12345", ":justinfan12345.tmi.twitch.tv 366 justinfan12345 #pajlada :End of /NAMES list");
            await Promise.all([promise, clientError]);
            chai_1.assert.deepStrictEqual([...client.joinedChannels], ["pajlada"]);
        });
        it("only adds to wantedChannels on msg_channel_suspended failure", async function () {
            // given
            const { client, emitAndEnd, clientError } = (0, helpers_spec_1.fakeConnection)();
            // when
            const promise = (0, join_1.joinChannel)(client, "test");
            emitAndEnd("@msg-id=msg_channel_suspended :tmi.twitch.tv NOTICE " +
                "#test :This channel has been suspended.");
            // then
            await (0, helpers_spec_1.assertErrorChain)(promise, join_1.JoinError, "Failed to join channel test: Bad response message: @msg-id=msg_cha" +
                "nnel_suspended :tmi.twitch.tv NOTICE #test :This channel has bee" +
                "n suspended.", errors_1.MessageError, "Bad response message: @msg-id=msg_channel_suspended :tmi.twitch.tv NOTICE " +
                "#test :This channel has been suspended.");
            await (0, helpers_spec_1.assertErrorChain)(clientError, join_1.JoinError, "Failed to join channel test: Bad response message: @msg-id=msg_cha" +
                "nnel_suspended :tmi.twitch.tv NOTICE #test :This channel has bee" +
                "n suspended.", errors_1.MessageError, "Bad response message: @msg-id=msg_channel_suspended :tmi.twitch.tv NOTICE " +
                "#test :This channel has been suspended.");
            chai_1.assert.deepStrictEqual([...client.wantedChannels], ["test"]);
            chai_1.assert.deepStrictEqual([...client.joinedChannels], []);
        });
        it("only adds to wantedChannels on connection close (no error)", async function () {
            // given
            const { end, client, clientError } = (0, helpers_spec_1.fakeConnection)();
            // when
            const promise = (0, join_1.joinChannel)(client, "pajlada");
            end();
            // then
            await (0, helpers_spec_1.assertErrorChain)(promise, join_1.JoinError, "Failed to join channel pajlada: Connection closed with no error", errors_1.ConnectionError, "Connection closed with no error");
            // no error
            await clientError;
            (0, chai_1.assert)(client.closed, "Client should be closed");
            chai_1.assert.deepStrictEqual([...client.wantedChannels], ["pajlada"]);
            chai_1.assert.deepStrictEqual([...client.joinedChannels], []);
        });
        it("only adds to wantedChannels on connection close (with error)", async function () {
            // given
            const { end, client, clientError } = (0, helpers_spec_1.fakeConnection)();
            // when
            const promise = (0, join_1.joinChannel)(client, "pajlada");
            end(new Error("peer reset connection"));
            // then
            await (0, helpers_spec_1.assertErrorChain)(promise, join_1.JoinError, "Failed to join channel pajlada: Connection closed " +
                "due to error: Error occurred in transport layer: p" +
                "eer reset connection", errors_1.ConnectionError, "Connection closed due to error: Error occurred in tran" +
                "sport layer: peer reset connection", errors_1.ConnectionError, "Error occurred in transport layer: peer reset connection", Error, "peer reset connection");
            await (0, helpers_spec_1.assertErrorChain)(clientError, errors_1.ConnectionError, "Error occurred in transport layer: peer reset connection", Error, "peer reset connection");
            (0, chai_1.assert)(client.closed, "Client should be closed");
            chai_1.assert.deepStrictEqual([...client.wantedChannels], ["pajlada"]);
            chai_1.assert.deepStrictEqual([...client.joinedChannels], []);
        });
        it("should fail on timeout of 2000 ms", async function () {
            // given
            sinon.useFakeTimers();
            const { client, clientError } = (0, helpers_spec_1.fakeConnection)();
            // when
            const promise = (0, join_1.joinChannel)(client, "test");
            // then
            sinon.clock.tick(2000);
            await (0, helpers_spec_1.assertErrorChain)(promise, join_1.JoinError, "Failed to join channel test: Timed out after waiting for res" +
                "ponse for 2000 milliseconds", timeout_error_1.TimeoutError, "Timed out after waiting for response for 2000 milliseconds");
            await (0, helpers_spec_1.assertErrorChain)(clientError, join_1.JoinError, "Failed to join channel test: Timed out after waiting for res" +
                "ponse for 2000 milliseconds", timeout_error_1.TimeoutError, "Timed out after waiting for response for 2000 milliseconds");
        });
    });
    describe("JoinError", function () {
        it("should not be instanceof ConnectionError", function () {
            chai_1.assert.notInstanceOf(new join_1.JoinError("test"), errors_1.ConnectionError);
        });
        it("should not be instanceof ClientError", function () {
            chai_1.assert.notInstanceOf(new join_1.JoinError("test"), errors_1.ClientError);
        });
    });
});
//# sourceMappingURL=join.spec.js.map