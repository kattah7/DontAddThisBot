"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canSpamFast = void 0;
const userstate_tracker_1 = require("../userstate-tracker");
function canSpamFast(channelName, loggedInUsername, userStateInput) {
    // broadcaster?
    if (channelName === loggedInUsername) {
        return { fastSpam: true, certain: true };
    }
    let userState;
    if (userStateInput instanceof userstate_tracker_1.UserStateTracker) {
        userState = userStateInput.getChannelState(channelName);
    }
    else {
        userState = userStateInput;
    }
    // no data
    if (userState == null) {
        return { fastSpam: false, certain: false };
    }
    // any of these?
    return {
        fastSpam: userState.isMod ||
            userState.badges.hasVIP ||
            userState.badges.hasModerator ||
            userState.badges.hasBroadcaster,
        certain: true,
    };
}
exports.canSpamFast = canSpamFast;
//# sourceMappingURL=utils.js.map