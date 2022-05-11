"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partChannel = exports.partNothingToDo = exports.awaitPartResponse = exports.PartError = void 0;
const await_response_1 = require("../await/await-response");
const errors_1 = require("../client/errors");
const part_1 = require("../message/twitch-types/membership/part");
class PartError extends errors_1.MessageError {
    failedChannelName;
    constructor(failedChannelName, message, cause) {
        super(message, cause);
        this.failedChannelName = failedChannelName;
    }
}
exports.PartError = PartError;
async function awaitPartResponse(conn, channelName) {
    return (0, await_response_1.awaitResponse)(conn, {
        // :justinfan12345!justinfan12345@justinfan12345.tmi.twitch.tv PART #pajlada
        success: (msg) => msg instanceof part_1.PartMessage &&
            msg.channelName === channelName &&
            msg.partedUsername === conn.configuration.username,
        errorType: (m, e) => new PartError(channelName, m, e),
        errorMessage: `Failed to part channel ${channelName}`,
    });
}
exports.awaitPartResponse = awaitPartResponse;
function partNothingToDo(conn, channelName) {
    return (!conn.wantedChannels.has(channelName) &&
        !conn.joinedChannels.has(channelName));
}
exports.partNothingToDo = partNothingToDo;
async function partChannel(conn, channelName) {
    if (partNothingToDo(conn, channelName)) {
        // nothing to do (already parted)
        return;
    }
    conn.sendRaw(`PART #${channelName}`);
    conn.wantedChannels.delete(channelName);
    const response = await awaitPartResponse(conn, channelName);
    conn.joinedChannels.delete(channelName);
    return response;
}
exports.partChannel = partChannel;
//# sourceMappingURL=part.js.map