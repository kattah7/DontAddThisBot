"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = void 0;
const eventemitter3_1 = require("eventemitter3");
const expanded_1 = require("../config/expanded");
const interface_1 = require("./interface");
class BaseClient extends eventemitter3_1.EventEmitter {
    get unconnected() {
        return this.state === interface_1.ClientState.UNCONNECTED;
    }
    get connecting() {
        return this.state === interface_1.ClientState.CONNECTING;
    }
    get connected() {
        return this.state === interface_1.ClientState.CONNECTED;
    }
    get ready() {
        return this.state === interface_1.ClientState.READY;
    }
    get closed() {
        return this.state === interface_1.ClientState.CLOSED;
    }
    configuration;
    state = interface_1.ClientState.UNCONNECTED;
    constructor(partialConfig) {
        super();
        this.configuration = (0, expanded_1.expandConfig)(partialConfig);
    }
    emitError(error, emitEvenIfClosed = false) {
        if (this.closed && !emitEvenIfClosed) {
            return;
        }
        this.emit("error", error);
    }
    emitMessage(message) {
        this.emit("message", message);
        this.emit(message.ircCommand, message);
    }
    emitConnecting() {
        if (this.advanceState(interface_1.ClientState.CONNECTING)) {
            this.emit("connecting");
        }
    }
    emitConnected() {
        if (this.advanceState(interface_1.ClientState.CONNECTED)) {
            this.emit("connect");
        }
    }
    emitReady() {
        if (this.advanceState(interface_1.ClientState.READY)) {
            this.emit("ready");
        }
    }
    emitClosed(error) {
        if (this.advanceState(interface_1.ClientState.CLOSED)) {
            this.emit("close", error);
        }
    }
    advanceState(newState) {
        if (newState <= this.state) {
            return false;
        }
        this.state = newState;
        return true;
    }
}
exports.BaseClient = BaseClient;
//# sourceMappingURL=base-client.js.map