"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinMessage = void 0;
const channel_irc_message_1 = require("../../irc/channel-irc-message");
const irc_message_1 = require("../../irc/irc-message");
class JoinMessage extends channel_irc_message_1.ChannelIRCMessage {
    joinedUsername;
    constructor(message) {
        super(message);
        this.joinedUsername = (0, irc_message_1.requireNickname)(this);
    }
}
exports.JoinMessage = JoinMessage;
//# sourceMappingURL=join.js.map