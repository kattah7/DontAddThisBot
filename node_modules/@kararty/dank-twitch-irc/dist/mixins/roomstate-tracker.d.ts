import { EventEmitter } from "eventemitter3";
import { ChatClient } from "../client/client";
import { RoomState } from "../message/twitch-types/roomstate";
import { ClientMixin } from "./base-mixin";
export interface RoomStateTrackerEvents {
    newChannelState(channelLogin: string, newState: RoomState): void;
}
/**
 * Tracks the state of the logged in user (the bot) in all channels the bot operates in
 */
export declare class RoomStateTracker extends EventEmitter<RoomStateTrackerEvents> implements ClientMixin {
    private readonly channelStates;
    getChannelState(channelName: string): RoomState | undefined;
    applyToClient(client: ChatClient): void;
    private onRoomstateMessage;
}
//# sourceMappingURL=roomstate-tracker.d.ts.map