"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HosttargetMessage = exports.parseHosttargetParameter = exports.parseViewerCount = exports.parseHostedChannelName = void 0;
const reason_for_value_1 = require("../../utils/reason-for-value");
const channel_irc_message_1 = require("../irc/channel-irc-message");
const irc_message_1 = require("../irc/irc-message");
const parse_error_1 = require("../parser/parse-error");
function parseHostedChannelName(rawHostedChannelName) {
    if (rawHostedChannelName == null || rawHostedChannelName.length <= 0) {
        throw new parse_error_1.ParseError(`Malformed channel part in HOSTTARGET message: ${(0, reason_for_value_1.reasonForValue)(rawHostedChannelName)}`);
    }
    if (rawHostedChannelName === "-") {
        return undefined;
    }
    else {
        return rawHostedChannelName;
    }
}
exports.parseHostedChannelName = parseHostedChannelName;
function parseViewerCount(rawViewerCount) {
    if (rawViewerCount == null || rawViewerCount.length <= 0) {
        throw new parse_error_1.ParseError(`Malformed viewer count part in HOSTTARGET message: ${(0, reason_for_value_1.reasonForValue)(rawViewerCount)}`);
    }
    if (rawViewerCount === "-") {
        return undefined;
    }
    const numberValue = parseInt(rawViewerCount);
    if (isNaN(numberValue)) {
        throw new parse_error_1.ParseError(`Malformed viewer count part in HOSTTARGET message: ${(0, reason_for_value_1.reasonForValue)(rawViewerCount)}`);
    }
    return numberValue;
}
exports.parseViewerCount = parseViewerCount;
function parseHosttargetParameter(rawParameter) {
    const split = rawParameter.split(" ");
    if (split.length !== 2) {
        throw new parse_error_1.ParseError("HOSTTARGET accepts exactly 2 arguments in second parameter, " +
            `given: ${(0, reason_for_value_1.reasonForValue)(rawParameter)}`);
    }
    const [rawHostedChannelName, rawViewerCount] = split;
    return {
        hostedChannelName: parseHostedChannelName(rawHostedChannelName),
        viewerCount: parseViewerCount(rawViewerCount),
    };
}
exports.parseHosttargetParameter = parseHosttargetParameter;
class HosttargetMessage extends channel_irc_message_1.ChannelIRCMessage {
    /**
     * channel name if now hosting channel,
     *
     * null if host mode was exited.
     */
    hostedChannelName;
    /**
     * The viewer count of the enabled host.
     *
     * null if viewercount is unknown or host mode was exited.
     */
    viewerCount;
    constructor(message) {
        super(message);
        const parsedSecondParameter = parseHosttargetParameter((0, irc_message_1.requireParameter)(this, 1));
        this.hostedChannelName = parsedSecondParameter.hostedChannelName;
        this.viewerCount = parsedSecondParameter.viewerCount;
    }
    wasHostModeExited() {
        return this.hostedChannelName == null;
    }
    wasHostModeEntered() {
        return this.hostedChannelName != null;
    }
}
exports.HosttargetMessage = HosttargetMessage;
//# sourceMappingURL=hosttarget.js.map