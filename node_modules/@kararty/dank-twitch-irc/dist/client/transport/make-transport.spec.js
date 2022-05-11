"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const stream_1 = require("stream");
const duplex_transport_1 = require("./duplex-transport");
const make_transport_1 = require("./make-transport");
const tcp_transport_1 = require("./tcp-transport");
const websocket_transport_1 = require("./websocket-transport");
describe("./client/transport/make-transport", function () {
    describe("#makeTransport()", function () {
        it("should make a TcpTransport for tcp configurations", function () {
            const config = {
                type: "tcp",
                secure: true,
                host: "irc.chat.twitch.tv",
                port: 6697,
                preSetup: false,
            };
            const transport = (0, make_transport_1.makeTransport)(config);
            chai_1.assert.instanceOf(transport, tcp_transport_1.TcpTransport);
        });
        it("should make a DuplexTransport for duplex configurations", function () {
            const config = {
                type: "duplex",
                stream: () => new stream_1.Duplex(),
                preSetup: false,
            };
            const transport = (0, make_transport_1.makeTransport)(config);
            chai_1.assert.instanceOf(transport, duplex_transport_1.DuplexTransport);
        });
        it("should make a WebSocketTransport for websocket configurations", function () {
            const config = {
                type: "websocket",
                url: "wss://irc-ws.chat.twitch.tv",
                preSetup: false,
            };
            const transport = (0, make_transport_1.makeTransport)(config);
            chai_1.assert.instanceOf(transport, websocket_transport_1.WebSocketTransport);
        });
        it("should throw an error on unknown transport type", function () {
            // @ts-ignore override typescript correcting us
            chai_1.assert.throws(() => (0, make_transport_1.makeTransport)({ type: "invalid" }), Error);
        });
    });
});
//# sourceMappingURL=make-transport.spec.js.map