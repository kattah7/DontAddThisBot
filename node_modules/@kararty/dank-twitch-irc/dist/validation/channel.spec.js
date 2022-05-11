"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_spec_1 = require("../helpers.spec");
const channel_1 = require("./channel");
const validation_error_1 = require("./validation-error");
describe("./validation/channel", function () {
    describe("#validateChannelName()", function () {
        it("rejects undefined", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, channel_1.validateChannelName)(undefined), validation_error_1.ValidationError, "Channel name undefined is invalid/malformed");
        });
        it("rejects null", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, channel_1.validateChannelName)(null), validation_error_1.ValidationError, "Channel name null is invalid/malformed");
        });
        it("rejects empty strings", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, channel_1.validateChannelName)(""), validation_error_1.ValidationError, "Channel name empty string is invalid/malformed");
        });
        it("allows single letters", function () {
            (0, channel_1.validateChannelName)("a");
            (0, channel_1.validateChannelName)("b");
            (0, channel_1.validateChannelName)("x");
            (0, channel_1.validateChannelName)("z");
        });
        it("allows underscores", function () {
            (0, channel_1.validateChannelName)("a_b");
            (0, channel_1.validateChannelName)("b___c");
            (0, channel_1.validateChannelName)("lack_of_sanity");
            (0, channel_1.validateChannelName)("just__get__a__house");
        });
        it("rejects uppercase letters", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, channel_1.validateChannelName)("Pajlada"), validation_error_1.ValidationError, 'Channel name "Pajlada" is invalid/malformed');
        });
    });
});
//# sourceMappingURL=channel.spec.js.map