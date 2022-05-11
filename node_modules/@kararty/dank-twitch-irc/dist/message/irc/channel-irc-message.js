"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelIRCMessage = exports.getIRCChannelName = void 0;
const parse_error_1 = require("../parser/parse-error");
const irc_message_1 = require("./irc-message");
function getIRCChannelName(message, optional = false) {
    const parameter = (0, irc_message_1.requireParameter)(message, 0);
    if (optional && parameter === "*") {
        return undefined;
    }
    if (!parameter.startsWith("#") || parameter.length < 2) {
        throw new parse_error_1.ParseError(`Received malformed IRC channel name "${parameter}"`);
    }
    return parameter.slice(1);
}
exports.getIRCChannelName = getIRCChannelName;
class ChannelIRCMessage extends irc_message_1.IRCMessage {
    channelName;
    constructor(message) {
        super(message);
        this.channelName = getIRCChannelName(this);
    }
}
exports.ChannelIRCMessage = ChannelIRCMessage;
//# sourceMappingURL=channel-irc-message.js.map