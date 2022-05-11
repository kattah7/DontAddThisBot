"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correctChannelName = exports.validateChannelName = void 0;
const reason_for_value_1 = require("../utils/reason-for-value");
const validation_error_1 = require("./validation-error");
const channelNameRegex = /^[a-z0-9_]{1,25}$/;
function validateChannelName(input) {
    if (input == null || !channelNameRegex.test(input)) {
        throw new validation_error_1.ValidationError(`Channel name ${(0, reason_for_value_1.reasonForValue)(input)} is invalid/malformed`);
    }
}
exports.validateChannelName = validateChannelName;
function correctChannelName(input) {
    return input.replace(/^#/, "");
}
exports.correctChannelName = correctChannelName;
//# sourceMappingURL=channel.js.map