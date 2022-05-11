"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPing = exports.PingTimeoutError = void 0;
const randombytes = require("randombytes");
const await_response_1 = require("../await/await-response");
const errors_1 = require("../client/errors");
const pong_1 = require("../message/twitch-types/connection/pong");
class PingTimeoutError extends errors_1.ConnectionError {
}
exports.PingTimeoutError = PingTimeoutError;
function randomPingIdentifier() {
    const randomHexString = randombytes(16).toString("hex").toLowerCase();
    return `dank-twitch-irc:manual:${randomHexString}`;
}
async function sendPing(conn, pingIdentifier = randomPingIdentifier(), timeout = 2000) {
    conn.sendRaw(`PING :${pingIdentifier}`);
    return (await (0, await_response_1.awaitResponse)(conn, {
        success: (msg) => msg instanceof pong_1.PongMessage && msg.argument === pingIdentifier,
        timeout,
        errorType: (message, cause) => new PingTimeoutError(message, cause),
        errorMessage: "Server did not PONG back",
    }));
}
exports.sendPing = sendPing;
//# sourceMappingURL=ping.js.map