"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeMessage = void 0;
const channel_irc_message_1 = require("../irc/channel-irc-message");
const irc_message_1 = require("../irc/irc-message");
const tag_values_1 = require("../parser/tag-values");
class NoticeMessage extends irc_message_1.IRCMessage {
    channelName;
    messageText;
    messageID;
    constructor(message) {
        super(message);
        // optional = true
        // so we can parse messages like :tmi.twitch.tv NOTICE * :Improperly formatted auth
        // that don't have a valid channel name
        this.channelName = (0, channel_irc_message_1.getIRCChannelName)(this, true);
        const tagParser = (0, tag_values_1.tagParserFor)(this.ircTags);
        this.messageText = (0, irc_message_1.requireParameter)(this, 1);
        this.messageID = tagParser.getString("msg-id");
    }
}
exports.NoticeMessage = NoticeMessage;
//# sourceMappingURL=notice.js.map