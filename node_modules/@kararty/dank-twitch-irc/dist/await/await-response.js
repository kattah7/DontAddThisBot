"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awaitResponse = exports.ResponseAwaiter = exports.alwaysTrue = exports.alwaysFalse = void 0;
const errors_1 = require("../client/errors");
const set_defaults_1 = require("../utils/set-defaults");
const timeout_error_1 = require("./timeout-error");
const alwaysFalse = () => false;
exports.alwaysFalse = alwaysFalse;
const alwaysTrue = () => true;
exports.alwaysTrue = alwaysTrue;
const configDefaults = {
    success: exports.alwaysFalse,
    failure: exports.alwaysFalse,
    timeout: 2000,
    noResponseAction: "failure",
};
class ResponseAwaiter {
    promise;
    unsubscribers = [];
    conn;
    config;
    resolvePromise;
    rejectPromise;
    constructor(conn, config) {
        this.conn = conn;
        this.config = (0, set_defaults_1.setDefaults)(config, configDefaults);
        this.promise = new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
        this.subscribeTo("close", this.onConnectionClosed);
        this.joinPendingResponsesQueue();
    }
    /**
     * Called when this response awaiter is inserted to the head of
     * the queue or moves to the queue head after a previous
     * response awaiter was rejected or resolved.
     */
    movedToQueueHead() {
        if (this.conn.connected || this.conn.ready) {
            this.beginTimeout();
        }
        else {
            const listener = this.beginTimeout.bind(this);
            this.conn.once("connect", listener);
            this.unsubscribers.push(() => this.conn.removeListener("connect", listener));
        }
    }
    /**
     * Called by a later awaiter indicating that this awaiter was still
     * in the queue while the later awaiter matched a response.
     */
    outpaced() {
        this.onNoResponse("A response to a command issued later than this command was received");
    }
    unsubscribe() {
        this.unsubscribers.forEach((fn) => fn());
    }
    resolve(msg) {
        this.unsubscribe();
        this.resolvePromise(msg);
    }
    reject(cause) {
        this.unsubscribe();
        const errorWithCause = this.config.errorType(this.config.errorMessage, cause);
        process.nextTick(() => this.conn.emitError(errorWithCause, true));
        this.rejectPromise(errorWithCause);
    }
    onNoResponse(reason) {
        if (this.config.noResponseAction === "failure") {
            this.reject(new timeout_error_1.TimeoutError(reason));
        }
        else if (this.config.noResponseAction === "success") {
            this.resolve(undefined);
        }
    }
    beginTimeout() {
        const registeredTimeout = setTimeout(() => {
            const reason = `Timed out after waiting for response for ${this.config.timeout} milliseconds`;
            this.onNoResponse(reason);
        }, this.config.timeout);
        this.unsubscribers.push(() => {
            clearTimeout(registeredTimeout);
        });
    }
    joinPendingResponsesQueue() {
        const ourIndex = this.conn.pendingResponses.push(this) - 1;
        if (ourIndex === 0) {
            this.movedToQueueHead();
        } // else: we are behind another awaiter
        // which will notify us via #movedToQueueHead() that we should
        // begin the timeout
        this.unsubscribers.push(() => {
            const selfPosition = this.conn.pendingResponses.indexOf(this);
            if (selfPosition < 0) {
                // we are not in the queue anymore (e.g. sliced off by other
                // awaiter)
                return;
            }
            // remove all awaiters, leading up to ourself
            const removedAwaiters = this.conn.pendingResponses.splice(0, selfPosition + 1);
            // remove ourself
            removedAwaiters.pop();
            // notify the other awaiters they were outpaced
            removedAwaiters.forEach((awaiter) => awaiter.outpaced());
            // notify the new queue head to begin its timeout
            const newQueueHead = this.conn.pendingResponses[0];
            if (newQueueHead != null) {
                newQueueHead.movedToQueueHead();
            }
        });
    }
    onConnectionClosed(cause) {
        if (cause != null) {
            this.reject(new errors_1.ConnectionError("Connection closed due to error", cause));
        }
        else {
            this.reject(new errors_1.ConnectionError("Connection closed with no error"));
        }
    }
    // returns true if something matched, preventing "later" matchers from
    // running against that message
    onConnectionMessage(msg) {
        if (this.config.failure(msg)) {
            this.reject(new errors_1.MessageError(`Bad response message: ${msg.rawSource}`));
            return true;
        }
        else if (this.config.success(msg)) {
            this.resolve(msg);
            return true;
        }
        return false;
    }
    subscribeTo(eventName, handler) {
        handler = handler.bind(this);
        this.conn.on(eventName, handler);
        this.unsubscribers.push(() => this.conn.removeListener(eventName, handler));
    }
}
exports.ResponseAwaiter = ResponseAwaiter;
function awaitResponse(conn, config) {
    return new ResponseAwaiter(conn, config).promise;
}
exports.awaitResponse = awaitResponse;
//# sourceMappingURL=await-response.js.map