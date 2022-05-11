import { ChatClient } from "../../client/client";
import { ClientMixin } from "../base-mixin";
export declare class SlowModeRateLimiter implements ClientMixin {
    static GLOBAL_SLOW_MODE_COOLDOWN: number;
    private readonly client;
    private readonly maxQueueLength;
    private readonly semaphores;
    private readonly runningTimers;
    constructor(client: ChatClient, maxQueueLength?: number);
    applyToClient(client: ChatClient): void;
    private getSemaphore;
    private onUserStateChange;
    private onRoomStateChange;
    private acquire;
    private getSlowModeDuration;
}
//# sourceMappingURL=slow-mode.d.ts.map