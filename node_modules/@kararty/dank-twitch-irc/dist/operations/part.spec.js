"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const timeout_error_1 = require("../await/timeout-error");
const helpers_spec_1 = require("../helpers.spec");
const join_1 = require("./join");
const part_1 = require("./part");
describe("./operations/part", function () {
    describe("#partNothingToDo()", function () {
        it("should be true if channel is not joined or wanted", function () {
            // channel is not joined and is not wanted either
            // (e.g. no join in progress)
            const { client } = (0, helpers_spec_1.fakeConnection)();
            client.wantedChannels.clear();
            client.joinedChannels.clear();
            chai_1.assert.isTrue((0, part_1.partNothingToDo)(client, "pajlada"));
        });
        it("should be false if channel is joined but not wanted", function () {
            // e.g. previous PART command failed, and channel remained joined
            // but not wanted.
            const { client } = (0, helpers_spec_1.fakeConnection)();
            client.wantedChannels.clear();
            client.joinedChannels.clear();
            client.joinedChannels.add("pajlada");
            chai_1.assert.isFalse((0, part_1.partNothingToDo)(client, "pajlada"));
        });
        it("should be false if channel is not joined but wanted", function () {
            // e.g. JOIN is currently in progress and we want to part already
            // again
            const { client } = (0, helpers_spec_1.fakeConnection)();
            client.wantedChannels.clear();
            client.wantedChannels.add("pajlada");
            client.joinedChannels.clear();
            chai_1.assert.isFalse((0, part_1.partNothingToDo)(client, "pajlada"));
        });
        it("should be false if channel is joined and wanted", function () {
            // normal situation where channel is joined and wanted and must be
            // parted.
            const { client } = (0, helpers_spec_1.fakeConnection)();
            client.wantedChannels.clear();
            client.wantedChannels.add("pajlada");
            client.joinedChannels.clear();
            chai_1.assert.isFalse((0, join_1.joinNothingToDo)(client, "pajlada"));
        });
    });
    describe("#partChannel()", function () {
        it("should send the correct wire command", function () {
            sinon.useFakeTimers();
            const { client, data } = (0, helpers_spec_1.fakeConnection)();
            client.joinedChannels.add("pajlada");
            client.wantedChannels.add("pajlada");
            (0, part_1.partChannel)(client, "pajlada");
            chai_1.assert.deepStrictEqual(data, ["PART #pajlada\r\n"]);
        });
        it("should do nothing if channel is neither wanted nor joined", async function () {
            const { client, data } = (0, helpers_spec_1.fakeConnection)();
            await (0, part_1.partChannel)(client, "pajlada");
            chai_1.assert.deepStrictEqual(data, []);
        });
        it("should remove channel from wanted channels even on timeout error", async function () {
            sinon.useFakeTimers();
            const { client, clientError } = (0, helpers_spec_1.fakeConnection)();
            client.joinedChannels.add("pajlada");
            client.wantedChannels.add("pajlada");
            const promise = (0, part_1.partChannel)(client, "pajlada");
            sinon.clock.tick(2000);
            await (0, helpers_spec_1.assertErrorChain)(promise, part_1.PartError, "Failed to part channel pajlada: Timed out after waiting for response for 2000 milliseconds", timeout_error_1.TimeoutError, "Timed out after waiting for response for 2000 milliseconds");
            await (0, helpers_spec_1.assertErrorChain)(clientError, part_1.PartError, "Failed to part channel pajlada: Timed out after waiting for response for 2000 milliseconds", timeout_error_1.TimeoutError, "Timed out after waiting for response for 2000 milliseconds");
            chai_1.assert.sameMembers([...client.joinedChannels], ["pajlada"]);
            chai_1.assert.sameMembers([...client.wantedChannels], []);
        });
        it("should remove channel from joined and wanted channels on success", async function () {
            const { client, emitAndEnd, clientError } = (0, helpers_spec_1.fakeConnection)();
            client.joinedChannels.add("pajlada");
            client.wantedChannels.add("pajlada");
            const promise = (0, part_1.partChannel)(client, "pajlada");
            emitAndEnd(":justinfan12345!justinfan12345@justinfan12345.tmi.twitch.tv PART #pajlada");
            await promise;
            chai_1.assert.sameMembers([...client.joinedChannels], []);
            chai_1.assert.sameMembers([...client.wantedChannels], []);
            await clientError;
        });
    });
});
//# sourceMappingURL=part.spec.js.map