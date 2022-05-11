"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyToServerPing = void 0;
function replyToServerPing(conn) {
    conn.on("PING", (msg) => {
        if (msg.argument == null) {
            conn.sendRaw("PONG");
        }
        else {
            conn.sendRaw(`PONG :${msg.argument}`);
        }
    });
}
exports.replyToServerPing = replyToServerPing;
//# sourceMappingURL=reply-to-ping.js.map