"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRateLimitPresets = void 0;
exports.messageRateLimitPresets = {
    default: {
        highPrivmsgLimits: 100,
        lowPrivmsgLimits: 20,
        // whispersPerSecond: 3,
        // whispersPerMinute: 100,
        // whisperTargetsPerDay: 40
    },
    knownBot: {
        highPrivmsgLimits: 100,
        lowPrivmsgLimits: 50,
        // whispersPerSecond: 10,
        // whispersPerMinute: 200,
        // whisperTargetsPerDay: 500
    },
    verifiedBot: {
        highPrivmsgLimits: 7500,
        lowPrivmsgLimits: 7500,
        // whispersPerSecond: 20,
        // whispersPerMinute: 1200,
        // whisperTargetsPerDay: 100000
    },
};
//# sourceMappingURL=message-rate-limits.js.map