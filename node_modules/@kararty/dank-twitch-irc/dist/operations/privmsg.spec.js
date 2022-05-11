"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helpers_spec_1 = require("../helpers.spec");
const privmsg_1 = require("./privmsg");
describe("./operations/privmsg", function () {
    describe("#sendPrivmsg()", function () {
        it("should send the correct wire command", function () {
            const { client, data } = (0, helpers_spec_1.fakeConnection)();
            (0, privmsg_1.sendPrivmsg)(client, "forsen", "Kappa Keepo PogChamp");
            chai_1.assert.deepStrictEqual(data, [
                "PRIVMSG #forsen :Kappa Keepo PogChamp\r\n",
            ]);
        });
    });
});
//# sourceMappingURL=privmsg.spec.js.map