"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStateTracker = void 0;
const eventemitter3_1 = require("eventemitter3");
/**
 * Tracks the state of the logged in user (the bot) in all channels the bot operates in
 */
class UserStateTracker extends eventemitter3_1.EventEmitter {
    globalState;
    channelStates = {};
    client;
    constructor(client) {
        super();
        this.client = client;
    }
    getChannelState(channelName) {
        return this.channelStates[channelName];
    }
    getGlobalState() {
        return this.globalState;
    }
    applyToClient(client) {
        client.userStateTracker = this;
        client.on("USERSTATE", this.onUserstateMessage.bind(this));
        client.on("GLOBALUSERSTATE", this.onGlobaluserstateMessage.bind(this));
        client.on("PRIVMSG", this.onPrivmsgMessage.bind(this));
    }
    onUserstateMessage(msg) {
        const newState = msg.extractUserState();
        this.channelStates[msg.channelName] = newState;
        this.emit("newChannelState", msg.channelName, newState);
    }
    onGlobaluserstateMessage(msg) {
        this.globalState = msg.extractGlobalUserState();
        this.emit("newGlobalState", this.globalState);
    }
    onPrivmsgMessage(msg) {
        if (msg.senderUsername !== this.client.configuration.username) {
            return;
        }
        const channelState = this.channelStates[msg.channelName];
        if (channelState != null) {
            const newState = Object.assign({}, channelState, msg.extractUserState());
            this.channelStates[msg.channelName] = newState;
            this.emit("newChannelState", msg.channelName, newState);
        }
    }
}
exports.UserStateTracker = UserStateTracker;
//# sourceMappingURL=userstate-tracker.js.map