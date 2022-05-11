"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const badge_1 = require("../badge");
const badges_1 = require("../badges");
const twitch_message_1 = require("../parser/twitch-message");
const globaluserstate_1 = require("./globaluserstate");
describe("./message/twitch-types/globaluserstate", function () {
    describe("GlobaluserstateMessage", function () {
        it("should be able to parse a real extensive GLOBALUSERSTATE message from twitch", function () {
            const msgText = "@badge-info=;badges=bits-charity/1;color=#19E6E6;display-name=RANDERS;" +
                "emote-sets=0,42,237,1564,1627,1937,2344,2470,4236,14417,15961,19194,198648,241281," +
                "445556,520063,771848,905510,1056965,1537462,1598955,1641460,1641461,1641462,300206295;" +
                "user-id=40286300;user-type= :tmi.twitch.tv GLOBALUSERSTATE";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, globaluserstate_1.GlobaluserstateMessage);
            chai_1.assert.deepStrictEqual(msg.badgeInfo, new badges_1.TwitchBadgesList());
            chai_1.assert.strictEqual(msg.badgeInfoRaw, "");
            chai_1.assert.deepStrictEqual(msg.badges, new badges_1.TwitchBadgesList(new badge_1.TwitchBadge("bits-charity", "1")));
            chai_1.assert.strictEqual(msg.badgesRaw, "bits-charity/1");
            chai_1.assert.deepStrictEqual(msg.color, { r: 0x19, g: 0xe6, b: 0xe6 });
            chai_1.assert.strictEqual(msg.colorRaw, "#19E6E6");
            chai_1.assert.strictEqual(msg.displayName, "RANDERS");
            chai_1.assert.deepStrictEqual(msg.emoteSets, [
                "0",
                "42",
                "237",
                "1564",
                "1627",
                "1937",
                "2344",
                "2470",
                "4236",
                "14417",
                "15961",
                "19194",
                "198648",
                "241281",
                "445556",
                "520063",
                "771848",
                "905510",
                "1056965",
                "1537462",
                "1598955",
                "1641460",
                "1641461",
                "1641462",
                "300206295",
            ]);
            chai_1.assert.strictEqual(msg.emoteSetsRaw, "0,42,237,1564,1627,1937,2344,2470,4236,14417,15961,19194,198648," +
                "241281,445556,520063,771848,905510,1056965,1537462,1598955,1641460,1641461,1641462,300206295");
            chai_1.assert.strictEqual("40286300", msg.userID);
            chai_1.assert.deepStrictEqual(msg.extractGlobalUserState(), {
                badgeInfo: new badges_1.TwitchBadgesList(),
                badgeInfoRaw: "",
                badges: new badges_1.TwitchBadgesList(new badge_1.TwitchBadge("bits-charity", "1")),
                badgesRaw: "bits-charity/1",
                color: { r: 0x19, g: 0xe6, b: 0xe6 },
                colorRaw: "#19E6E6",
                displayName: "RANDERS",
                emoteSets: [
                    "0",
                    "42",
                    "237",
                    "1564",
                    "1627",
                    "1937",
                    "2344",
                    "2470",
                    "4236",
                    "14417",
                    "15961",
                    "19194",
                    "198648",
                    "241281",
                    "445556",
                    "520063",
                    "771848",
                    "905510",
                    "1056965",
                    "1537462",
                    "1598955",
                    "1641460",
                    "1641461",
                    "1641462",
                    "300206295",
                ],
                emoteSetsRaw: "0,42,237,1564,1627,1937,2344,2470,4236,14417,15961,19194,198648," +
                    "241281,445556,520063,771848,905510,1056965,1537462,1598955,1641460,1641461,1641462,300206295",
                userID: "40286300",
            });
        });
        it("should be able to parse a real minimal GLOBALUSERSTATE message from twitch", function () {
            const msgText = "@badge-info=;badges=;color=;display-name=receivertest3;emote-sets=0;user-id=422021310;" +
                "user-type= :tmi.twitch.tv GLOBALUSERSTATE";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.instanceOf(msg, globaluserstate_1.GlobaluserstateMessage);
            chai_1.assert.deepStrictEqual(msg.badgeInfo, new badges_1.TwitchBadgesList());
            chai_1.assert.strictEqual(msg.badgeInfoRaw, "");
            chai_1.assert.deepStrictEqual(msg.badges, new badges_1.TwitchBadgesList());
            chai_1.assert.strictEqual(msg.badgesRaw, "");
            chai_1.assert.isUndefined(msg.color);
            chai_1.assert.strictEqual(msg.colorRaw, "");
            chai_1.assert.strictEqual(msg.displayName, "receivertest3");
            chai_1.assert.deepStrictEqual(msg.emoteSets, ["0"]);
            chai_1.assert.strictEqual(msg.emoteSetsRaw, "0");
            chai_1.assert.strictEqual("422021310", msg.userID);
            chai_1.assert.deepStrictEqual(msg.extractGlobalUserState(), {
                badgeInfo: new badges_1.TwitchBadgesList(),
                badgeInfoRaw: "",
                badges: new badges_1.TwitchBadgesList(),
                badgesRaw: "",
                color: undefined,
                colorRaw: "",
                displayName: "receivertest3",
                emoteSets: ["0"],
                emoteSetsRaw: "0",
                userID: "422021310",
            });
        });
        it("trims spaces at the end of display names", function () {
            const msgText = "@badge-info=;badges=;color=;display-name=receivertest3\\s;emote-sets=0;user-id=422021310;" +
                "user-type= :tmi.twitch.tv GLOBALUSERSTATE";
            const msg = (0, twitch_message_1.parseTwitchMessage)(msgText);
            chai_1.assert.strictEqual(msg.displayName, "receivertest3");
            chai_1.assert.strictEqual(msg.extractGlobalUserState().displayName, "receivertest3");
        });
    });
});
//# sourceMappingURL=globaluserstate.spec.js.map