"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowModeRateLimiter = void 0;
const semaphore_async_await_1 = require("semaphore-async-await");
const apply_function_replacements_1 = require("../../utils/apply-function-replacements");
const editable_timeout_1 = require("../../utils/editable-timeout");
const utils_1 = require("./utils");
class SlowModeRateLimiter {
    static GLOBAL_SLOW_MODE_COOLDOWN = 1.5;
    client;
    maxQueueLength;
    semaphores = {};
    runningTimers = {};
    constructor(client, maxQueueLength = 10) {
        this.client = client;
        this.maxQueueLength = maxQueueLength;
    }
    applyToClient(client) {
        const genericReplament = async (oldFn, channelName, ...args) => {
            const releaseFn = await this.acquire(channelName);
            if (releaseFn == null) {
                // queue is full
                // message is dropped
                return;
            }
            try {
                return await oldFn(channelName, ...args);
            }
            finally {
                releaseFn();
            }
        };
        (0, apply_function_replacements_1.applyReplacements)(this, client, {
            say: genericReplament,
            me: genericReplament,
            privmsg: genericReplament,
        });
        if (client.roomStateTracker != null) {
            client.roomStateTracker.on("newChannelState", this.onRoomStateChange.bind(this));
        }
        if (client.userStateTracker != null) {
            client.userStateTracker.on("newChannelState", this.onUserStateChange.bind(this));
        }
    }
    getSemaphore(channelName) {
        let semaphore = this.semaphores[channelName];
        if (semaphore == null) {
            semaphore = new semaphore_async_await_1.default(1);
            this.semaphores[channelName] = semaphore;
        }
        return semaphore;
    }
    onUserStateChange(channelName, newState) {
        const { fastSpam, certain } = (0, utils_1.canSpamFast)(channelName, this.client.configuration.username, newState);
        const runningTimer = this.runningTimers[channelName];
        if (fastSpam && runningTimer != null) {
            runningTimer.update(0);
        }
        if (certain && channelName in this.semaphores) {
            const semaphore = this.getSemaphore(channelName);
            const waiterQueue = 
            // @ts-ignore private member access
            semaphore.promiseResolverQueue;
            // trim waiter queue
            const removedWaiters = waiterQueue.splice(10);
            for (const removedWaiter of removedWaiters) {
                removedWaiter(false);
            }
        }
    }
    onRoomStateChange(channelName, newState) {
        // new slow mode?
        const newSlowModeDuration = Math.max(newState.slowModeDuration, SlowModeRateLimiter.GLOBAL_SLOW_MODE_COOLDOWN);
        const runningTimer = this.runningTimers[channelName];
        if (runningTimer != null) {
            runningTimer.update(newSlowModeDuration);
        }
    }
    async acquire(channelName) {
        const { fastSpam, certain } = (0, utils_1.canSpamFast)(channelName, this.client.configuration.username, this.client.userStateTracker);
        // nothing is acquired and nothing has to be released
        if (fastSpam) {
            // tslint:disable-next-line:no-empty
            return () => { };
        }
        const semaphore = this.getSemaphore(channelName);
        // @ts-ignore private member access
        const waiterQueue = semaphore.promiseResolverQueue;
        // too many waiting. Message will be dropped.
        // note that we do NOT drop messages when we are unsure about
        // fast spam state (e.g. before the first USERSTATE is received)
        if (certain && waiterQueue.length >= this.maxQueueLength) {
            return undefined;
        }
        const releaseFn = () => {
            const { fastSpam: fastSpamAfterRelease } = (0, utils_1.canSpamFast)(channelName, this.client.configuration.username, this.client.userStateTracker);
            if (fastSpamAfterRelease) {
                semaphore.release();
                return;
            }
            const slowModeDuration = this.getSlowModeDuration(channelName);
            this.runningTimers[channelName] = new editable_timeout_1.EditableTimeout(() => {
                delete this.runningTimers[channelName];
                semaphore.release();
            }, slowModeDuration * 1000);
        };
        // if success === false then this awaiter got released by the queue
        // being trimmed (see above in onUserStateChange) which happens
        // when fastSpam state becomes `certain` and there are more messages
        // waiting than the maximum. In that case the message should not be
        // sent, so we return undefined on the spot. We also don't have to
        // release anything.
        const success = await semaphore.acquire();
        if (!success) {
            return undefined;
        }
        // if we were released by a incoming USERSTATE change (the timer was
        // edited) and spam can now be fast, return the token immediately
        // and return a no-op releaseFn.
        const { fastSpam: fastSpamAfterAwait } = (0, utils_1.canSpamFast)(channelName, this.client.configuration.username, this.client.userStateTracker);
        if (fastSpamAfterAwait) {
            semaphore.release();
            // tslint:disable-next-line:no-empty
            return () => { };
        }
        return releaseFn;
    }
    getSlowModeDuration(channelName) {
        if (this.client.roomStateTracker != null) {
            const roomState = this.client.roomStateTracker.getChannelState(channelName);
            if (roomState != null) {
                return Math.max(roomState.slowModeDuration, SlowModeRateLimiter.GLOBAL_SLOW_MODE_COOLDOWN);
            }
        }
        return SlowModeRateLimiter.GLOBAL_SLOW_MODE_COOLDOWN;
    }
}
exports.SlowModeRateLimiter = SlowModeRateLimiter;
//# sourceMappingURL=slow-mode.js.map