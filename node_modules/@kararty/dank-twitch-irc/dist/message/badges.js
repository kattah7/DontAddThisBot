"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchBadgesList = void 0;
class TwitchBadgesList extends Array {
    get hasAdmin() {
        return this.find((e) => e.isAdmin) != null;
    }
    get hasBits() {
        return this.find((e) => e.isBits) != null;
    }
    get hasBroadcaster() {
        return this.find((e) => e.isBroadcaster) != null;
    }
    get hasGlobalMod() {
        return this.find((e) => e.isGlobalMod) != null;
    }
    get hasModerator() {
        return this.find((e) => e.isModerator) != null;
    }
    get hasSubscriber() {
        return this.find((e) => e.isSubscriber) != null;
    }
    get hasStaff() {
        return this.find((e) => e.isStaff) != null;
    }
    get hasTurbo() {
        return this.find((e) => e.isTurbo) != null;
    }
    get hasVIP() {
        return this.find((e) => e.isVIP) != null;
    }
    toString() {
        return this.join(",");
    }
}
exports.TwitchBadgesList = TwitchBadgesList;
//# sourceMappingURL=badges.js.map