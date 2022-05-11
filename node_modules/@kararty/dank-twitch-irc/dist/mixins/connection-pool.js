"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionPool = void 0;
const apply_function_replacements_1 = require("../utils/apply-function-replacements");
class ConnectionPool {
    client;
    poolSize;
    constructor(client, options) {
        this.client = client;
        this.poolSize = options.poolSize;
    }
    applyToClient(client) {
        client.connectionPool = this;
        const replacement = (oldFn, predicate) => {
            this.ensureEnoughConnections();
            return oldFn(predicate);
        };
        (0, apply_function_replacements_1.applyReplacements)(this, client, {
            requireConnection: replacement,
        });
    }
    ensureEnoughConnections() {
        while (this.client.connections.length < this.poolSize) {
            this.client.newConnection();
        }
    }
}
exports.ConnectionPool = ConnectionPool;
//# sourceMappingURL=connection-pool.js.map