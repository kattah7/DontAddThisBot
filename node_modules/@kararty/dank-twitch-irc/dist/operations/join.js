"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinChannel = exports.joinNothingToDo = exports.awaitJoinResponse = exports.JoinError = void 0;
const await_response_1 = require("../await/await-response");
const errors_1 = require("../client/errors");
const join_1 = require("../message/twitch-types/membership/join");
const notice_1 = require("../message/twitch-types/notice");
class JoinError extends errors_1.MessageError {
    failedChannelName;
    constructor(failedChannelName, message, cause) {
        super(message, cause);
        this.failedChannelName = failedChannelName;
    }
}
exports.JoinError = JoinError;
function awaitJoinResponse(conn, channelName) {
    return (0, await_response_1.awaitResponse)(conn, {
        success: (msg) => msg instanceof join_1.JoinMessage &&
            msg.channelName === channelName &&
            msg.joinedUsername === conn.configuration.username,
        failure: (msg) => msg instanceof notice_1.NoticeMessage &&
            msg.channelName === channelName &&
            msg.messageID === "msg_channel_suspended",
        errorType: (m, e) => new JoinError(channelName, m, e),
        errorMessage: `Failed to join channel ${channelName}`,
    });
}
exports.awaitJoinResponse = awaitJoinResponse;
function joinNothingToDo(conn, channelName) {
    return (conn.wantedChannels.has(channelName) && conn.joinedChannels.has(channelName));
}
exports.joinNothingToDo = joinNothingToDo;
async function joinChannel(conn, channelName) {
    if (joinNothingToDo(conn, channelName)) {
        return;
    }
    conn.wantedChannels.add(channelName);
    conn.sendRaw(`JOIN #${channelName}`);
    const response = await awaitJoinResponse(conn, channelName);
    conn.joinedChannels.add(channelName);
    return response;
}
exports.joinChannel = joinChannel;
//# sourceMappingURL=join.js.map