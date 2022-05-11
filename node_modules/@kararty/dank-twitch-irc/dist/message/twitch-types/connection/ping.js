"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingMessage = void 0;
const irc_message_1 = require("../../irc/irc-message");
class PingMessage extends irc_message_1.IRCMessage {
    argument;
    constructor(message) {
        super(message);
        this.argument = (0, irc_message_1.getParameter)(this, 1);
    }
}
exports.PingMessage = PingMessage;
//# sourceMappingURL=ping.js.map