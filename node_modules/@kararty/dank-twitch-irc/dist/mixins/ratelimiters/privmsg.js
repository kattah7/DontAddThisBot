"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivmsgMessageRateLimiter = void 0;
const semaphore_async_await_1 = require("semaphore-async-await");
const apply_function_replacements_1 = require("../../utils/apply-function-replacements");
const utils_1 = require("./utils");
class PrivmsgMessageRateLimiter {
    client;
    highPrivmsgSemaphore;
    lowPrivmsgSemaphore;
    constructor(client) {
        this.client = client;
        this.highPrivmsgSemaphore = new semaphore_async_await_1.default(this.client.configuration.rateLimits.highPrivmsgLimits);
        this.lowPrivmsgSemaphore = new semaphore_async_await_1.default(this.client.configuration.rateLimits.lowPrivmsgLimits);
    }
    applyToClient(client) {
        const genericReplament = async (oldFn, channelName, ...args) => {
            const releaseFn = await this.acquire(channelName);
            try {
                return await oldFn(channelName, ...args);
            }
            finally {
                setTimeout(releaseFn, 35 * 1000);
            }
        };
        (0, apply_function_replacements_1.applyReplacements)(this, client, {
            say: genericReplament,
            me: genericReplament,
            privmsg: genericReplament,
        });
    }
    async acquire(channelName) {
        const { fastSpam } = (0, utils_1.canSpamFast)(channelName, this.client.configuration.username, this.client.userStateTracker);
        const promises = [];
        promises.push(this.highPrivmsgSemaphore.acquire());
        if (!fastSpam) {
            promises.push(this.lowPrivmsgSemaphore.acquire());
        }
        const releaseFn = () => {
            if (!fastSpam) {
                this.lowPrivmsgSemaphore.release();
            }
            this.highPrivmsgSemaphore.release();
        };
        await Promise.all(promises);
        return releaseFn;
    }
}
exports.PrivmsgMessageRateLimiter = PrivmsgMessageRateLimiter;
//# sourceMappingURL=privmsg.js.map