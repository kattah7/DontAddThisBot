"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCapabilities = exports.deniedAnyCapability = exports.acknowledgesCapabilities = exports.CapabilitiesError = void 0;
const await_response_1 = require("../await/await-response");
const errors_1 = require("../client/errors");
const cap_1 = require("../message/twitch-types/cap");
class CapabilitiesError extends errors_1.ConnectionError {
}
exports.CapabilitiesError = CapabilitiesError;
function acknowledgesCapabilities(requestedCapabilities) {
    return (e) => e instanceof cap_1.CapMessage &&
        e.subCommand === "ACK" &&
        requestedCapabilities.every((cap) => e.capabilities.includes(cap));
}
exports.acknowledgesCapabilities = acknowledgesCapabilities;
function deniedAnyCapability(requestedCapabilities) {
    return (e) => e instanceof cap_1.CapMessage &&
        e.subCommand === "NAK" &&
        requestedCapabilities.some((cap) => e.capabilities.includes(cap));
}
exports.deniedAnyCapability = deniedAnyCapability;
async function requestCapabilities(conn, requestMembershipCapability) {
    const capabilities = ["twitch.tv/commands", "twitch.tv/tags"];
    if (requestMembershipCapability) {
        capabilities.push("twitch.tv/membership");
    }
    conn.sendRaw(`CAP REQ :${capabilities.join(" ")}`);
    // CAP ACK :twitch.tv/commands twitch.tv/tags twitch.tv/membership
    // CAP NAK :twitch.tv/invalid
    await (0, await_response_1.awaitResponse)(conn, {
        success: acknowledgesCapabilities(capabilities),
        failure: deniedAnyCapability(capabilities),
        errorType: (message, cause) => new CapabilitiesError(message, cause),
        errorMessage: `Failed to request server capabilities ${capabilities.join(", ")}`,
    });
}
exports.requestCapabilities = requestCapabilities;
//# sourceMappingURL=request-capabilities.js.map