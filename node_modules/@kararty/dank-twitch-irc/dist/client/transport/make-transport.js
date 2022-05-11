"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTransport = void 0;
const duplex_transport_1 = require("./duplex-transport");
const tcp_transport_1 = require("./tcp-transport");
const websocket_transport_1 = require("./websocket-transport");
function makeTransport(config) {
    switch (config.type) {
        case "tcp":
            return new tcp_transport_1.TcpTransport(config);
        case "duplex":
            return new duplex_transport_1.DuplexTransport(config);
        case "websocket":
            return new websocket_transport_1.WebSocketTransport(config);
        default:
            throw new Error("Unknown transport type");
    }
}
exports.makeTransport = makeTransport;
//# sourceMappingURL=make-transport.js.map