"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplexTransport = void 0;
class DuplexTransport {
    stream;
    constructor(config) {
        this.stream = config.stream();
    }
    connect(connectionListener) {
        if (connectionListener != null) {
            // invoke now (duplex is already connected)
            setImmediate(connectionListener);
        }
    }
}
exports.DuplexTransport = DuplexTransport;
//# sourceMappingURL=duplex-transport.js.map