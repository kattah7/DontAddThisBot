import { EventEmitter } from "eventemitter3";
import { ChatClient } from "../client/client";
import { GlobalUserState } from "../message/twitch-types/globaluserstate";
import { UserState } from "../message/twitch-types/userstate";
import { ClientMixin } from "./base-mixin";
export interface UserStateTrackerEvents {
    newGlobalState(newState: GlobalUserState): void;
    newChannelState(channelLogin: string, newState: UserState): void;
}
/**
 * Tracks the state of the logged in user (the bot) in all channels the bot operates in
 */
export declare class UserStateTracker extends EventEmitter<UserStateTrackerEvents> implements ClientMixin {
    globalState?: GlobalUserState;
    channelStates: Record<string, UserState>;
    private readonly client;
    constructor(client: ChatClient);
    getChannelState(channelName: string): UserState | undefined;
    getGlobalState(): GlobalUserState | undefined;
    applyToClient(client: ChatClient): void;
    private onUserstateMessage;
    private onGlobaluserstateMessage;
    private onPrivmsgMessage;
}
//# sourceMappingURL=userstate-tracker.d.ts.map