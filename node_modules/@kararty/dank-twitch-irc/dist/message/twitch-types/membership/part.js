"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartMessage = void 0;
const channel_irc_message_1 = require("../../irc/channel-irc-message");
const irc_message_1 = require("../../irc/irc-message");
class PartMessage extends channel_irc_message_1.ChannelIRCMessage {
    partedUsername;
    constructor(message) {
        super(message);
        this.partedUsername = (0, irc_message_1.requireNickname)(this);
    }
}
exports.PartMessage = PartMessage;
//# sourceMappingURL=part.js.map