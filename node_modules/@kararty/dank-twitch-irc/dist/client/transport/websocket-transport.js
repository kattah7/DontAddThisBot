"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketTransport = void 0;
const duplexify = require("duplexify");
const WebSocketDuplex = require("simple-websocket");
const stream_1 = require("stream");
class WebSocketTransport {
    stream;
    readable;
    writable;
    config;
    wsStream;
    constructor(config) {
        this.config = config;
        this.readable = new stream_1.PassThrough({ decodeStrings: false, objectMode: true });
        this.writable = new stream_1.PassThrough({ decodeStrings: false, objectMode: true });
        this.stream = duplexify(this.writable, this.readable, {
            decodeStrings: false,
            objectMode: true,
        });
    }
    connect(connectionListener) {
        this.wsStream = new WebSocketDuplex({
            url: this.config.url,
            decodeStrings: false,
            objectMode: true,
        });
        if (connectionListener != null) {
            this.wsStream.once("connect", connectionListener);
        }
        this.wsStream.pipe(this.readable);
        this.writable.pipe(this.wsStream);
    }
}
exports.WebSocketTransport = WebSocketTransport;
//# sourceMappingURL=websocket-transport.js.map