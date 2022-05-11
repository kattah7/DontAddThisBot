"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPrivmsg = void 0;
async function sendPrivmsg(conn, channelName, message, replyTo) {
    if (replyTo)
        conn.sendRaw(`@reply-parent-msg-id=${replyTo} PRIVMSG #${channelName} :${message}`);
    else
        conn.sendRaw(`PRIVMSG #${channelName} :${message}`);
}
exports.sendPrivmsg = sendPrivmsg;
//# sourceMappingURL=privmsg.js.map