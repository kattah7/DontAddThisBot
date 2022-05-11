"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchingNotice = void 0;
const notice_1 = require("../message/twitch-types/notice");
function matchingNotice(channelName, noticeIDs) {
    return (msg) => {
        return (msg instanceof notice_1.NoticeMessage &&
            msg.channelName === channelName &&
            noticeIDs.includes(msg.messageID));
    };
}
exports.matchingNotice = matchingNotice;
//# sourceMappingURL=conditions.js.map