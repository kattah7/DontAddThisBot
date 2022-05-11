"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleConnection = void 0;
const debugLogger = require("debug-logger");
const split2 = require("split2");
const handle_reconnect_message_1 = require("../functionalities/handle-reconnect-message");
const reply_to_ping_1 = require("../functionalities/reply-to-ping");
const send_pings_1 = require("../functionalities/send-pings");
const twitch_message_1 = require("../message/parser/twitch-message");
const login_1 = require("../operations/login");
const request_capabilities_1 = require("../operations/request-capabilities");
const any_cause_instanceof_1 = require("../utils/any-cause-instanceof");
const ignore_errors_1 = require("../utils/ignore-errors");
const irc_command_1 = require("../validation/irc-command");
const base_client_1 = require("./base-client");
const errors_1 = require("./errors");
const make_transport_1 = require("./transport/make-transport");
let connectionIDCounter = 0;
class SingleConnection extends base_client_1.BaseClient {
    connectionID = connectionIDCounter++;
    wantedChannels = new Set();
    joinedChannels = new Set();
    pendingResponses = [];
    transport;
    log = debugLogger(`dank-twitch-irc:connection:${this.connectionID}`);
    constructor(configuration) {
        super(configuration);
        this.on("error", (e) => {
            if ((0, any_cause_instanceof_1.anyCauseInstanceof)(e, errors_1.ConnectionError)) {
                process.nextTick(() => {
                    this.emitClosed(e);
                    this.transport.stream.destroy(e);
                });
            }
        });
        this.on("connect", this.onConnect.bind(this));
        this.transport = (0, make_transport_1.makeTransport)(this.configuration.connection);
        this.transport.stream.on("close", () => {
            this.emitClosed();
        });
        this.transport.stream.on("error", (e) => {
            const emittedError = new errors_1.ConnectionError("Error occurred in transport layer", e);
            this.emitError(emittedError);
            this.emitClosed(emittedError);
            this.transport.stream.destroy(emittedError);
        });
        this.transport.stream.pipe(split2()).on("data", this.handleLine.bind(this));
        (0, reply_to_ping_1.replyToServerPing)(this);
        (0, handle_reconnect_message_1.handleReconnectMessage)(this);
        this.on("message", (msg) => {
            for (const awaiter of this.pendingResponses) {
                const stop = awaiter.onConnectionMessage(msg);
                if (stop) {
                    break;
                }
            }
        });
    }
    connect() {
        if (!this.unconnected) {
            throw new Error("connect() may only be called on unconnected connections");
        }
        this.emitConnecting();
        if (!this.configuration.connection.preSetup) {
            const promises = [
                (0, request_capabilities_1.requestCapabilities)(this, this.configuration.requestMembershipCapability),
                (0, login_1.sendLogin)(this, this.configuration.username, this.configuration.password),
            ];
            Promise.all(promises).then(() => this.emitReady(), ignore_errors_1.ignoreErrors);
        }
        else {
            this.once("connect", () => {
                process.nextTick(() => this.emitReady());
            });
        }
        this.transport.connect(() => this.emitConnected());
    }
    close() {
        // -> close is emitted
        this.transport.stream.destroy();
    }
    destroy(error) {
        this.transport.stream.destroy(error);
    }
    sendRaw(command) {
        (0, irc_command_1.validateIRCCommand)(command);
        this.emit("rawCommmand", command);
        this.log.trace(">", command);
        this.transport.stream.write(command + "\r\n");
    }
    onConnect() {
        (0, send_pings_1.sendClientPings)(this);
    }
    use(mixin) {
        mixin.applyToConnection(this);
    }
    handleLine(line) {
        if (line.length <= 0) {
            // ignore empty lines (allowed in IRC)
            return;
        }
        this.log.trace("<", line);
        let message;
        try {
            message = (0, twitch_message_1.parseTwitchMessage)(line);
        }
        catch (e) {
            this.emitError(new errors_1.ProtocolError(`Error while parsing IRC message from line "${line}"`, e));
            return;
        }
        this.emitMessage(message);
    }
}
exports.SingleConnection = SingleConnection;
//# sourceMappingURL=connection.js.map