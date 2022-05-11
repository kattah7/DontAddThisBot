"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const errors_1 = require("../client/errors");
const helpers_spec_1 = require("../helpers.spec");
const twitch_message_1 = require("../message/parser/twitch-message");
const base_error_1 = require("../utils/base-error");
const ignore_errors_1 = require("../utils/ignore-errors");
const await_response_1 = require("./await-response");
const timeout_error_1 = require("./timeout-error");
describe("./await/await-response", function () {
    describe("ResponseAwaiter", function () {
        it("should add itself to list of waiters", function () {
            const { client, end } = (0, helpers_spec_1.fakeConnection)();
            const awaiter1 = new await_response_1.ResponseAwaiter(client, {
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter 1 failure",
            });
            awaiter1.promise.catch(ignore_errors_1.ignoreErrors);
            const awaiter2 = new await_response_1.ResponseAwaiter(client, {
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter 2 failure",
            });
            awaiter2.promise.catch(ignore_errors_1.ignoreErrors);
            chai_1.assert.deepStrictEqual(client.pendingResponses, [awaiter1, awaiter2]);
            end();
        });
        it("should resolve on matching incoming message", async function () {
            const { client, end } = (0, helpers_spec_1.fakeConnection)();
            const wantedMsg = (0, twitch_message_1.parseTwitchMessage)("PONG :tmi.twitch.tv");
            const promise = (0, await_response_1.awaitResponse)(client, {
                success: (msg) => msg === wantedMsg,
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter failure",
            });
            client.emitMessage(wantedMsg);
            end();
            chai_1.assert.strictEqual(await promise, wantedMsg);
            chai_1.assert.deepStrictEqual(client.pendingResponses, []);
        });
        it("should reject on matching incoming message", async function () {
            const { client, clientError, emitAndEnd } = (0, helpers_spec_1.fakeConnection)();
            const wantedMsg = "PONG :tmi.twitch.tv";
            const promise = (0, await_response_1.awaitResponse)(client, {
                failure: (msg) => msg.rawSource === wantedMsg,
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter failure",
            });
            emitAndEnd(wantedMsg);
            await (0, helpers_spec_1.assertErrorChain)(promise, base_error_1.BaseError, "test awaiter failure: Bad response message: PONG :tmi.twitch.tv", errors_1.MessageError, "Bad response message: PONG :tmi.twitch.tv");
            chai_1.assert.deepStrictEqual(client.pendingResponses, []);
            await (0, helpers_spec_1.assertErrorChain)(clientError, base_error_1.BaseError, "test awaiter failure: Bad response message: PONG :tmi.twitch.tv", errors_1.MessageError, "Bad response message: PONG :tmi.twitch.tv");
        });
        it("should reject on connection close (no error)", async function () {
            const { client, end, clientError } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, await_response_1.awaitResponse)(client, {
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter failure",
            });
            end();
            const clientErrorAfterClose = new Promise((resolve, reject) => {
                client.once("error", reject);
            });
            await (0, helpers_spec_1.assertErrorChain)([promise, clientErrorAfterClose], base_error_1.BaseError, "test awaiter failure: Connection closed with no error", errors_1.ConnectionError, "Connection closed with no error");
            // the client is closed so the error occurring after close is not
            // emitted -> clientError is resolved because on("close") happens
            // before our ResponseAwaiter emits the error
            await clientError;
        });
        it("should reject on connection close (with error)", async function () {
            const { client, end, clientError } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, await_response_1.awaitResponse)(client, {
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter failure",
            });
            end(new Error("peer reset connection"));
            // TODO create a utility to await error no #N on arbitrary EventEmitter
            const clientErrorAfterClose = new Promise((resolve, reject) => {
                let counter = 0;
                const target = 1;
                client.on("error", (e) => {
                    if (counter++ === target) {
                        reject(e);
                    }
                });
            });
            await (0, helpers_spec_1.assertErrorChain)(promise, base_error_1.BaseError, "test awaiter failure: Connection closed due to error: Error occurred in transport layer: peer reset connection", errors_1.ConnectionError, "Connection closed due to error: Error occurred in transport layer: peer reset connection", errors_1.ConnectionError, "Error occurred in transport layer: peer reset connection", Error, "peer reset connection");
            await (0, helpers_spec_1.assertErrorChain)(clientError, errors_1.ConnectionError, "Error occurred in transport layer: peer reset connection", Error, "peer reset connection");
            await (0, helpers_spec_1.assertErrorChain)(clientErrorAfterClose, base_error_1.BaseError, "test awaiter failure: Connection closed due to error: Error occurred in transport layer: peer reset connection", errors_1.ConnectionError, "Connection closed due to error: Error occurred in transport layer: peer reset connection", errors_1.ConnectionError, "Error occurred in transport layer: peer reset connection", Error, "peer reset connection");
        });
        it("should timeout after specified timeout (noResponseAction = failure)", async function () {
            sinon.useFakeTimers();
            const { client, clientError } = (0, helpers_spec_1.fakeConnection)();
            // awaiter is going to be the only awaiter in the queue so
            // it starts the timeout
            // awaiters should wait until they are at the head of the queue
            // to start their timeout
            const promise = (0, await_response_1.awaitResponse)(client, {
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter failure",
                timeout: 3000,
            });
            sinon.clock.tick(3000);
            await (0, helpers_spec_1.assertErrorChain)([promise, clientError], base_error_1.BaseError, "test awaiter failure: Timed out after waiting for response for 3000 milliseconds", timeout_error_1.TimeoutError, "Timed out after waiting for response for 3000 milliseconds");
        });
        it("should timeout after specified timeout (noResponseAction = success)", async function () {
            sinon.useFakeTimers();
            const { client, clientError, end } = (0, helpers_spec_1.fakeConnection)();
            // awaiter is going to be the only awaiter in the queue so
            // it starts the timeout
            // awaiters should wait until they are at the head of the queue
            // to start their timeout
            const promise = (0, await_response_1.awaitResponse)(client, {
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter failure",
                timeout: 3000,
                noResponseAction: "success",
            });
            sinon.clock.tick(3000);
            end();
            await Promise.all([promise, clientError]);
        });
        it("should begin timeout only once awaiter is moved to head of queue", async function () {
            sinon.useFakeTimers();
            const { client, clientError } = (0, helpers_spec_1.fakeConnection)();
            const promise1 = (0, await_response_1.awaitResponse)(client, {
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter1 failure",
                timeout: 1000,
            });
            const promise2 = (0, await_response_1.awaitResponse)(client, {
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter2 failure",
                timeout: 1000,
            });
            sinon.clock.tick(1000);
            await (0, helpers_spec_1.assertErrorChain)([promise1, clientError], base_error_1.BaseError, "test awaiter1 failure: Timed out after waiting for response for 1000 milliseconds", timeout_error_1.TimeoutError, "Timed out after waiting for response for 1000 milliseconds");
            sinon.clock.tick(1000);
            await (0, helpers_spec_1.assertErrorChain)(promise2, base_error_1.BaseError, "test awaiter2 failure: Timed out after waiting for response for 1000 milliseconds", timeout_error_1.TimeoutError, "Timed out after waiting for response for 1000 milliseconds");
        });
        it("should notify other awaiters that they are outpaced", async function () {
            const { client, emitAndEnd, clientError } = (0, helpers_spec_1.fakeConnection)();
            const promise1 = (0, await_response_1.awaitResponse)(client, {
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter1 failure",
            });
            const expectedMsg = "PONG :tmi.twitch.tv";
            const promise2 = (0, await_response_1.awaitResponse)(client, {
                success: (msg) => msg.rawSource === expectedMsg,
                errorType: (message, cause) => new base_error_1.BaseError(message, cause),
                errorMessage: "test awaiter2 failure",
            });
            // awaiter2 will resolve -> awaiter1 will be rejected because it was
            // outpaced
            emitAndEnd(expectedMsg);
            await (0, helpers_spec_1.assertErrorChain)([promise1, clientError], base_error_1.BaseError, "test awaiter1 failure: A response to a command issued later than this command was received", timeout_error_1.TimeoutError, "A response to a command issued later than this command was received");
            const matchedMsg = await promise2;
            chai_1.assert.strictEqual(matchedMsg.rawSource, expectedMsg);
        });
    });
});
//# sourceMappingURL=await-response.spec.js.map