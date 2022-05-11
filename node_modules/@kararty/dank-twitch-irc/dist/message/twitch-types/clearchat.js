"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearchatMessage = void 0;
const channel_irc_message_1 = require("../irc/channel-irc-message");
const irc_message_1 = require("../irc/irc-message");
const tag_values_1 = require("../parser/tag-values");
class ClearchatMessage extends channel_irc_message_1.ChannelIRCMessage {
    /**
     * The target username, undefined if this <code>CLEARCHAT</code> message clears
     * the entire chat.
     */
    targetUsername;
    /**
     * length in seconds (integer), undefined if permanent ban
     */
    banDuration;
    constructor(message) {
        super(message);
        const tagParser = (0, tag_values_1.tagParserFor)(this.ircTags);
        this.targetUsername = (0, irc_message_1.getParameter)(this, 1);
        this.banDuration = tagParser.getInt("ban-duration");
    }
    wasChatCleared() {
        return this.targetUsername == null && this.banDuration == null;
    }
    isTimeout() {
        return this.targetUsername != null && this.banDuration != null;
    }
    isPermaban() {
        return this.targetUsername != null && this.banDuration == null;
    }
}
exports.ClearchatMessage = ClearchatMessage;
//# sourceMappingURL=clearchat.js.map