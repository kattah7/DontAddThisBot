"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeClient = exports.fakeConnection = exports.createMockTransport = exports.assertThrowsChain = exports.assertErrorChain = exports.causeOf = exports.errorOf = void 0;
const chai = require("chai");
const chai_1 = require("chai");
const chaiAsPromised = require("chai-as-promised");
require("clarify");
const sinon = require("sinon");
const stream_1 = require("stream");
const util_1 = require("util");
const util = require("util");
const client_1 = require("./client/client");
const connection_1 = require("./client/connection");
chai.config.includeStack = true;
chai.use(chaiAsPromised);
afterEach(function () {
    sinon.restore();
});
afterEach(function () {
    if (this.currentTest != null && this.currentTest.err != null) {
        // tslint:disable-next-line:no-console
        console.error((0, util_1.inspect)(this.currentTest.err, { colors: true }));
        // tslint:disable-next-line:no-console
        console.error("Below is the default mocha output:");
    }
});
function errorOf(p) {
    return p.catch((e) => e);
}
exports.errorOf = errorOf;
async function causeOf(p) {
    return (await errorOf(p)).cause;
}
exports.causeOf = causeOf;
function assertLink(e, chain, depth = 0) {
    const [errorType, message, ...newChain] = chain;
    const actualPrototype = Object.getPrototypeOf(e);
    const expectedPrototype = errorType.prototype;
    chai_1.assert.strictEqual(actualPrototype, expectedPrototype, `Error at depth ${depth} should be directly instanceof ` +
        `${util.inspect(expectedPrototype)}, ` +
        `is instance of: ${util.inspect(actualPrototype)}`);
    chai_1.assert.strictEqual(e.message, message, `Error at depth ${depth} should have error message "${message}"`);
    // @ts-ignore e.cause is unknown to the compiler
    const cause = e.cause;
    if (newChain.length > 0) {
        (0, chai_1.assert)("cause" in e, `Error at depth ${depth} should have a cause`);
        (0, chai_1.assert)(cause != null, `Error at depth ${depth} should have a cause`);
        assertLink(cause, newChain, depth + 1);
    }
    else {
        (0, chai_1.assert)(cause == null, `Error at depth ${depth} should not have a cause, ` +
            `but has the following cause: ${(0, util_1.inspect)(cause)}`);
    }
}
function assertErrorChain(e, ...chain) {
    if (e instanceof Error || e == null) {
        (0, chai_1.assert)(e != null, "Error must be non-null");
        assertLink(e, chain);
    }
    else {
        return (async () => {
            if (!Array.isArray(e)) {
                e = [e];
            }
            for (const eElement of e) {
                await chai_1.assert.isRejected(eElement);
                const error = await errorOf(eElement);
                assertLink(error, chain);
            }
        })();
    }
}
exports.assertErrorChain = assertErrorChain;
function assertThrowsChain(f, ...chain) {
    try {
        f();
    }
    catch (e) {
        assertErrorChain(e, ...chain);
        return;
    }
    chai_1.assert.fail("Function did not throw an exception");
}
exports.assertThrowsChain = assertThrowsChain;
function createMockTransport() {
    const data = [];
    const transport = new stream_1.Duplex({
        autoDestroy: true,
        emitClose: true,
        decodeStrings: false,
        defaultEncoding: "utf-8",
        encoding: "utf-8",
        write(chunk, encoding, callback) {
            data.push(chunk.toString());
            callback();
        },
        // tslint:disable-next-line:no-empty
        read() { },
    });
    const emit = (...lines) => {
        transport.push(lines.map((line) => line + "\r\n").join(""));
    };
    const end = (error) => {
        transport.destroy(error);
    };
    const emitAndEnd = (...lines) => {
        setImmediate(emit, ...lines);
        setImmediate(end);
    };
    return {
        transport,
        data,
        emit,
        end,
        emitAndEnd,
    };
}
exports.createMockTransport = createMockTransport;
function fakeConnection() {
    // don't start sending pings
    sinon.stub(connection_1.SingleConnection.prototype, "onConnect");
    const transport = createMockTransport();
    const fakeConn = new connection_1.SingleConnection({
        connection: {
            type: "duplex",
            stream: () => transport.transport,
            preSetup: true,
        },
    });
    fakeConn.connect();
    return {
        ...transport,
        client: fakeConn,
        clientError: new Promise((resolve, reject) => {
            fakeConn.once("error", (e) => reject(e));
            fakeConn.once("close", () => resolve());
        }),
    };
}
exports.fakeConnection = fakeConnection;
function fakeClient(connect = true) {
    const transports = [];
    const getStream = () => {
        const newTransport = createMockTransport();
        transports.push(newTransport);
        return newTransport.transport;
    };
    const client = new client_1.ChatClient({
        connection: {
            type: "duplex",
            stream: getStream,
            preSetup: true,
        },
        installDefaultMixins: false,
    });
    if (connect) {
        client.connect();
    }
    return {
        emit: (...lines) => transports[0].emit(...lines),
        emitAndEnd: (...lines) => {
            transports[0].emit(...lines);
            setImmediate(() => client.destroy());
        },
        end: () => {
            client.destroy();
        },
        client,
        clientError: new Promise((resolve, reject) => {
            client.once("error", (e) => reject(e));
            client.once("close", () => resolve());
        }),
        transports,
    };
}
exports.fakeClient = fakeClient;
//# sourceMappingURL=helpers.spec.js.map