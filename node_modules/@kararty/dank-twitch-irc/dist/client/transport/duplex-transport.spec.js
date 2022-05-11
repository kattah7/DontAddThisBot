"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const stream_1 = require("stream");
const duplex_transport_1 = require("./duplex-transport");
describe("./client/transport/duplex-transport", function () {
    describe("DuplexTransport", function () {
        it("should call the stream-getter function from the config once", function () {
            const stream = new stream_1.Duplex();
            const streamGetter = sinon.fake.returns(stream);
            const config = {
                type: "duplex",
                stream: streamGetter,
                preSetup: false,
            };
            const transport = new duplex_transport_1.DuplexTransport(config);
            chai_1.assert.strictEqual(streamGetter.callCount, 1);
            chai_1.assert.strictEqual(transport.stream, stream);
        });
    });
});
//# sourceMappingURL=duplex-transport.spec.js.map