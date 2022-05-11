"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const timeout_error_1 = require("../await/timeout-error");
const errors_1 = require("../client/errors");
const helpers_spec_1 = require("../helpers.spec");
const ping_1 = require("./ping");
describe("./operations/ping", function () {
    describe("#sendPing()", function () {
        it("should send the correct wire command if ping identifier is specified", function () {
            sinon.useFakeTimers(); // prevent the promise timing out
            const { data, client } = (0, helpers_spec_1.fakeConnection)();
            (0, ping_1.sendPing)(client, "some identifier");
            chai_1.assert.deepStrictEqual(data, ["PING :some identifier\r\n"]);
        });
        it("should send a random ping identifier if no ping identifier is specified", function () {
            sinon.useFakeTimers(); // prevent the promise timing out
            const { data, client } = (0, helpers_spec_1.fakeConnection)();
            (0, ping_1.sendPing)(client);
            chai_1.assert.strictEqual(data.length, 1);
            chai_1.assert.match(data[0], /^PING :dank-twitch-irc:manual:[0-9a-f]{32}\r\n$/);
        });
        it("should resolve on matching PONG", async function () {
            const { client, emitAndEnd, clientError } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, ping_1.sendPing)(client, "some identifier");
            emitAndEnd(":tmi.twitch.tv PONG tmi.twitch.tv :some identifier");
            const pongMessage = await promise;
            chai_1.assert.strictEqual(pongMessage.argument, "some identifier");
            await clientError;
        });
        it("should reject on timeout of 2000 milliseconds by default", async function () {
            sinon.useFakeTimers();
            const { client, clientError } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, ping_1.sendPing)(client, "some identifier");
            sinon.clock.tick(2000);
            await (0, helpers_spec_1.assertErrorChain)(promise, ping_1.PingTimeoutError, "Server did not PONG back: Timed out after waiting for response for 2000 milliseconds", timeout_error_1.TimeoutError, "Timed out after waiting for response for 2000 milliseconds");
            await (0, helpers_spec_1.assertErrorChain)(clientError, ping_1.PingTimeoutError, "Server did not PONG back: Timed out after waiting for response for 2000 milliseconds", timeout_error_1.TimeoutError, "Timed out after waiting for response for 2000 milliseconds");
        });
    });
    describe("PingTimeoutError", function () {
        it("should be instanceof ConnectionError", function () {
            chai_1.assert.instanceOf(new ping_1.PingTimeoutError(), errors_1.ConnectionError);
        });
        it("should not be instanceof ClientError", function () {
            chai_1.assert.notInstanceOf(new ping_1.PingTimeoutError(), errors_1.ClientError);
        });
    });
});
//# sourceMappingURL=ping.spec.js.map