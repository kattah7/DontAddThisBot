"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendClientPings = void 0;
const ping_1 = require("../operations/ping");
const set_defaults_1 = require("../utils/set-defaults");
const configDefaults = {
    interval: 60 * 1000,
    timeout: 2 * 1000,
};
function sendClientPings(conn, config = {}) {
    const { interval, timeout } = (0, set_defaults_1.setDefaults)(config, configDefaults);
    let pingIDCounter = 0;
    const runAutomaticPing = async () => {
        const pingIdentifier = `dank-twitch-irc:automatic:${pingIDCounter++}`;
        try {
            await (0, ping_1.sendPing)(conn, pingIdentifier, timeout);
        }
        catch (e) {
            // ignored
        }
    };
    const registeredInterval = setInterval(runAutomaticPing, interval);
    conn.once("close", () => clearInterval(registeredInterval));
}
exports.sendClientPings = sendClientPings;
//# sourceMappingURL=send-pings.js.map