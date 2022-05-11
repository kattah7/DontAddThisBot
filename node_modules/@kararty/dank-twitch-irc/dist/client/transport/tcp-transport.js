"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpTransport = void 0;
const net_1 = require("net");
const tls_1 = require("tls");
class TcpTransport {
    stream;
    backingSocket;
    config;
    constructor(config) {
        this.config = config;
        if (config.secure) {
            this.backingSocket = new net_1.Socket();
            this.backingSocket.setNoDelay(true);
            this.stream = new tls_1.TLSSocket(this.backingSocket);
        }
        else {
            this.stream = new net_1.Socket();
        }
        this.stream.setNoDelay(true);
        this.stream.setDefaultEncoding("utf-8"); // for writing
        this.stream.setEncoding("utf-8"); // for reading
        this.stream.cork();
    }
    connect(connectionListener) {
        if (this.backingSocket != null) {
            this.backingSocket.connect(this.config.port, this.config.host);
        }
        this.stream.connect(this.config.port, this.config.host, () => {
            this.stream.uncork();
            if (connectionListener != null) {
                connectionListener();
            }
        });
    }
}
exports.TcpTransport = TcpTransport;
//# sourceMappingURL=tcp-transport.js.map