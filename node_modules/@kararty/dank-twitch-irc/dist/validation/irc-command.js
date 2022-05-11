"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIRCCommand = void 0;
const validation_error_1 = require("./validation-error");
function validateIRCCommand(command) {
    if (command.includes("\n") || command.includes("\r")) {
        throw new validation_error_1.ValidationError("IRC command may not include \\n or \\r");
    }
}
exports.validateIRCCommand = validateIRCCommand;
//# sourceMappingURL=irc-command.js.map