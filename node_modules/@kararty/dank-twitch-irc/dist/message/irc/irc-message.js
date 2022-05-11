"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireNickname = exports.requireParameter = exports.getParameter = exports.IRCMessage = void 0;
const missing_data_error_1 = require("../parser/missing-data-error");
class IRCMessage {
    rawSource;
    ircPrefixRaw;
    ircPrefix;
    /**
     * The parser ensures this is always uppercase
     */
    ircCommand;
    ircParameters;
    ircTags;
    constructor(messageData) {
        this.rawSource = messageData.rawSource;
        this.ircPrefixRaw = messageData.ircPrefixRaw;
        this.ircPrefix = messageData.ircPrefix;
        this.ircCommand = messageData.ircCommand;
        this.ircParameters = messageData.ircParameters;
        this.ircTags = messageData.ircTags;
    }
}
exports.IRCMessage = IRCMessage;
function getParameter(message, idx) {
    return message.ircParameters[idx];
}
exports.getParameter = getParameter;
function requireParameter(message, idx) {
    if (message.ircParameters.length <= idx) {
        throw new missing_data_error_1.MissingDataError(`Parameter at index ${idx} missing`);
    }
    return message.ircParameters[idx];
}
exports.requireParameter = requireParameter;
function requireNickname(message) {
    if (message.ircPrefix == null || message.ircPrefix.nickname == null) {
        throw new missing_data_error_1.MissingDataError("Missing prefix or missing nickname in prefix");
    }
    return message.ircPrefix.nickname;
}
exports.requireNickname = requireNickname;
//# sourceMappingURL=irc-message.js.map