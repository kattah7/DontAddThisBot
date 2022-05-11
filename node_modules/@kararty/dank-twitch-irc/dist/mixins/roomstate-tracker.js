"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomStateTracker = void 0;
const debugLogger = require("debug-logger");
const eventemitter3_1 = require("eventemitter3");
const roomstate_1 = require("../message/twitch-types/roomstate");
const log = debugLogger("dank-twitch-irc:roomstate-tracker");
/**
 * Tracks the state of the logged in user (the bot) in all channels the bot operates in
 */
class RoomStateTracker extends eventemitter3_1.EventEmitter {
    channelStates = {};
    getChannelState(channelName) {
        return this.channelStates[channelName];
    }
    applyToClient(client) {
        client.roomStateTracker = this;
        client.on("ROOMSTATE", this.onRoomstateMessage.bind(this));
    }
    onRoomstateMessage(msg) {
        const currentState = this.getChannelState(msg.channelName);
        const extractedState = msg.extractRoomState();
        if (currentState == null) {
            if (!(0, roomstate_1.hasAllStateTags)(extractedState)) {
                log.warn("Got incomplete ROOMSTATE before receiving complete roomstate:", msg.rawSource);
                return;
            }
            this.channelStates[msg.channelName] = extractedState;
            this.emit("newChannelState", msg.channelName, extractedState);
        }
        else {
            const newState = Object.assign({}, currentState, extractedState);
            this.channelStates[msg.channelName] = newState;
            this.emit("newChannelState", msg.channelName, newState);
        }
    }
}
exports.RoomStateTracker = RoomStateTracker;
//# sourceMappingURL=roomstate-tracker.js.map