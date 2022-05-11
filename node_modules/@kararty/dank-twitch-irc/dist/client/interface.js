"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientState = void 0;
var ClientState;
(function (ClientState) {
    ClientState[ClientState["UNCONNECTED"] = 0] = "UNCONNECTED";
    ClientState[ClientState["CONNECTING"] = 1] = "CONNECTING";
    ClientState[ClientState["CONNECTED"] = 2] = "CONNECTED";
    ClientState[ClientState["READY"] = 3] = "READY";
    ClientState[ClientState["CLOSED"] = 4] = "CLOSED";
})(ClientState = exports.ClientState || (exports.ClientState = {}));
//# sourceMappingURL=interface.js.map