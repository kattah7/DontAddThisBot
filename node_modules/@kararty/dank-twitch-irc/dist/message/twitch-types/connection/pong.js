"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongMessage = void 0;
const irc_message_1 = require("../../irc/irc-message");
class PongMessage extends irc_message_1.IRCMessage {
    argument;
    constructor(message) {
        super(message);
        this.argument = (0, irc_message_1.getParameter)(this, 1);
    }
}
exports.PongMessage = PongMessage;
//# sourceMappingURL=pong.js.map