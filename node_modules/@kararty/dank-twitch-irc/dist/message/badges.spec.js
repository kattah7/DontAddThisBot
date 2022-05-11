"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const badge_1 = require("./badge");
const badges_1 = require("./badges");
describe("./message/badges", function () {
    describe("TwitchBadgesList", function () {
        describe("hasKnownBadge style getters", function () {
            const testCases = [
                ["admin", "1", (b) => b.hasAdmin],
                ["bits", "1", (b) => b.hasBits],
                ["bits", "1000", (b) => b.hasBits],
                ["broadcaster", "1", (b) => b.hasBroadcaster],
                ["global_mod", "1", (b) => b.hasGlobalMod],
                ["moderator", "1", (b) => b.hasModerator],
                ["subscriber", "1", (b) => b.hasSubscriber],
                ["subscriber", "6", (b) => b.hasSubscriber],
                ["subscriber", "12", (b) => b.hasSubscriber],
                ["subscriber", "15", (b) => b.hasSubscriber],
                ["staff", "1", (b) => b.hasStaff],
                ["turbo", "1", (b) => b.hasTurbo],
                ["vip", "1", (b) => b.hasVIP],
            ];
            for (const [badgeName, badgeVersion, getter] of testCases) {
                it(`should recognize ${badgeName}/${badgeVersion}`, function () {
                    const badgeList = new badges_1.TwitchBadgesList();
                    badgeList.push(new badge_1.TwitchBadge(badgeName, badgeVersion));
                    (0, chai_1.assert)(getter(badgeList));
                });
            }
        });
        it("should return badge1,badge2,badge3 from toString()", function () {
            const list = new badges_1.TwitchBadgesList();
            list.push(new badge_1.TwitchBadge("admin", "1"), new badge_1.TwitchBadge("vip", "1"), new badge_1.TwitchBadge("subscriber", "12"));
            chai_1.assert.strictEqual("admin/1,vip/1,subscriber/12", list.toString());
        });
        it("should return badge1,badge2,badge3 from implicit toString()", function () {
            const list = new badges_1.TwitchBadgesList();
            list.push(new badge_1.TwitchBadge("admin", "1"), new badge_1.TwitchBadge("vip", "1"), new badge_1.TwitchBadge("subscriber", "12"));
            chai_1.assert.strictEqual("admin/1,vip/1,subscriber/12", `${list.toString()}`);
            chai_1.assert.strictEqual("admin/1,vip/1,subscriber/12", list + "");
        });
    });
});
//# sourceMappingURL=badges.spec.js.map