import { ChannelIRCMessage } from "../irc/channel-irc-message";
import { IRCMessageData } from "../irc/irc-message";
export interface RoomState {
    emoteOnly: boolean;
    emoteOnlyRaw: string;
    /**
     * followers-only duration in minutes
     */
    followersOnlyDuration: number;
    followersOnlyDurationRaw: string;
    r9k: boolean;
    r9kRaw: string;
    slowModeDuration: number;
    slowModeDurationRaw: string;
    subscribersOnly: boolean;
    subscribersOnlyRaw: string;
}
export declare function hasAllStateTags(partialRoomState: Partial<RoomState>): partialRoomState is RoomState;
export declare class RoomstateMessage extends ChannelIRCMessage {
    readonly channelID: string;
    readonly emoteOnly: boolean | undefined;
    readonly emoteOnlyRaw: string | undefined;
    readonly followersOnlyDuration: number | undefined;
    readonly followersOnlyDurationRaw: string | undefined;
    readonly r9k: boolean | undefined;
    readonly r9kRaw: string | undefined;
    readonly slowModeDuration: number | undefined;
    readonly slowModeDurationRaw: string | undefined;
    readonly subscribersOnly: boolean | undefined;
    readonly subscribersOnlyRaw: string | undefined;
    constructor(message: IRCMessageData);
    extractRoomState(): Partial<RoomState>;
}
//# sourceMappingURL=roomstate.d.ts.map