"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionRateLimiter = void 0;
const semaphore_async_await_1 = require("semaphore-async-await");
const apply_function_replacements_1 = require("../../utils/apply-function-replacements");
class ConnectionRateLimiter {
    client;
    semaphore;
    constructor(client) {
        this.client = client;
        this.semaphore = new semaphore_async_await_1.default(this.client.configuration.connectionRateLimits.parallelConnections);
    }
    async acquire() {
        await this.semaphore.acquire();
    }
    releaseOnConnect(conn) {
        const unsubscribers = [];
        const unsubscribe = () => {
            unsubscribers.forEach((e) => e());
        };
        const done = () => {
            unsubscribe();
            setTimeout(() => this.semaphore.release(), this.client.configuration.connectionRateLimits.releaseTime);
        };
        conn.on("connect", done);
        conn.on("close", done);
        unsubscribers.push(() => conn.removeListener("connect", done));
        unsubscribers.push(() => conn.removeListener("close", done));
    }
    applyToClient(client) {
        client.connectionMixins.push(this);
    }
    applyToConnection(connection) {
        // override transport.connect
        (0, apply_function_replacements_1.applyReplacements)(this, connection.transport, {
            connect(originalFn, connectionListener) {
                this.acquire().then(() => {
                    originalFn(connectionListener);
                    this.releaseOnConnect(connection);
                });
            },
        });
    }
}
exports.ConnectionRateLimiter = ConnectionRateLimiter;
//# sourceMappingURL=connection.js.map