"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_spec_1 = require("../helpers.spec");
const irc_command_1 = require("./irc-command");
const validation_error_1 = require("./validation-error");
describe("./validation/irc-command", function () {
    describe("#validateIRCCommand", function () {
        it("should reject newlines", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_command_1.validateIRCCommand)("JOIN\n"), validation_error_1.ValidationError, "IRC command may not include \\n or \\r");
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_command_1.validateIRCCommand)("\n"), validation_error_1.ValidationError, "IRC command may not include \\n or \\r");
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_command_1.validateIRCCommand)("\nJOIN"), validation_error_1.ValidationError, "IRC command may not include \\n or \\r");
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_command_1.validateIRCCommand)("JOIN\nJOIN"), validation_error_1.ValidationError, "IRC command may not include \\n or \\r");
        });
        it("should reject carriage returns", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_command_1.validateIRCCommand)("JOIN\r"), validation_error_1.ValidationError, "IRC command may not include \\n or \\r");
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_command_1.validateIRCCommand)("\r"), validation_error_1.ValidationError, "IRC command may not include \\n or \\r");
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_command_1.validateIRCCommand)("\rJOIN"), validation_error_1.ValidationError, "IRC command may not include \\n or \\r");
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_command_1.validateIRCCommand)("JOIN\rJOIN"), validation_error_1.ValidationError, "IRC command may not include \\n or \\r");
        });
        it("should pass normal IRC commands", function () {
            (0, irc_command_1.validateIRCCommand)("JOIN");
            (0, irc_command_1.validateIRCCommand)("");
            (0, irc_command_1.validateIRCCommand)("PRIVMSG #forsen :asd");
            (0, irc_command_1.validateIRCCommand)("JOIN #pajlada");
        });
    });
});
//# sourceMappingURL=irc-command.spec.js.map