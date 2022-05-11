export interface MessageRateLimits {
    highPrivmsgLimits: number;
    lowPrivmsgLimits: number;
}
export declare type PresetKeys = "default" | "knownBot" | "verifiedBot";
export declare const messageRateLimitPresets: Record<PresetKeys, MessageRateLimits>;
//# sourceMappingURL=message-rate-limits.d.ts.map