"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const errors_1 = require("../client/errors");
const helpers_spec_1 = require("../helpers.spec");
const login_1 = require("./login");
describe("./operations/login", function () {
    describe("#sendLogin()", function () {
        it("should only send NICK if password == null", function () {
            sinon.useFakeTimers(); // prevent the promise timing out
            const { data, client } = (0, helpers_spec_1.fakeConnection)();
            (0, login_1.sendLogin)(client, "justinfan12345", undefined);
            chai_1.assert.deepEqual(data, ["NICK justinfan12345\r\n"]);
        });
        it("should send NICK and PASS if password is specified", function () {
            sinon.useFakeTimers(); // prevent the promise timing out
            const { data, client } = (0, helpers_spec_1.fakeConnection)();
            (0, login_1.sendLogin)(client, "justinfan12345", "SCHMOOPIE");
            chai_1.assert.deepEqual(data, ["PASS SCHMOOPIE\r\n", "NICK justinfan12345\r\n"]);
        });
        it("should prepend oauth: if missing", function () {
            sinon.useFakeTimers(); // prevent the promise timing out
            const { data, client } = (0, helpers_spec_1.fakeConnection)();
            (0, login_1.sendLogin)(client, "pajlada", "12345");
            chai_1.assert.deepEqual(data, ["PASS oauth:12345\r\n", "NICK pajlada\r\n"]);
        });
        it("should resolve on 001", async function () {
            const { client, clientError, emitAndEnd } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, login_1.sendLogin)(client, "justinfan12345", "SCHMOOPIE");
            emitAndEnd(":tmi.twitch.tv 001 justinfan12345 :Welcome, GLHF!");
            // no error should occur
            await promise;
            await clientError;
        });
        it("should reject with LoginError on NOTICE", async function () {
            const { client, clientError, emitAndEnd } = (0, helpers_spec_1.fakeConnection)();
            const promise = (0, login_1.sendLogin)(client, "justinfan12345", "SCHMOOPIE");
            emitAndEnd(":tmi.twitch.tv NOTICE * :Improperly formatted auth");
            await (0, helpers_spec_1.assertErrorChain)(promise, login_1.LoginError, "Failed to login: Bad response message: :tmi.twitch" +
                ".tv NOTICE * :Improperly formatted auth", errors_1.MessageError, "Bad response message: :tmi.twitch.tv NOTICE * :Improperly formatted auth");
            await (0, helpers_spec_1.assertErrorChain)(clientError, login_1.LoginError, "Failed to login: Bad response message: :tmi.twitch." +
                "tv NOTICE * :Improperly formatted auth", errors_1.MessageError, "Bad response message: :tmi.twitch.tv NOTICE * :Improperly formatted auth");
        });
    });
    describe("LoginError", function () {
        it("should be instanceof ConnectionError", function () {
            chai_1.assert.instanceOf(new login_1.LoginError(), errors_1.ConnectionError);
        });
        it("should not be instanceof ClientError", function () {
            chai_1.assert.notInstanceOf(new login_1.LoginError(), errors_1.ClientError);
        });
    });
});
//# sourceMappingURL=login.spec.js.map