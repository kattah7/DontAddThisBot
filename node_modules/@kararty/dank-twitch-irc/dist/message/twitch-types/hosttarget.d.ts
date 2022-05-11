import { ChannelIRCMessage } from "../irc/channel-irc-message";
import { IRCMessageData } from "../irc/irc-message";
export declare function parseHostedChannelName(rawHostedChannelName: string | undefined): string | undefined;
export declare function parseViewerCount(rawViewerCount: string | undefined): number | undefined;
export declare function parseHosttargetParameter(rawParameter: string): {
    hostedChannelName: string | undefined;
    viewerCount: number | undefined;
};
export declare class HosttargetMessage extends ChannelIRCMessage {
    /**
     * channel name if now hosting channel,
     *
     * null if host mode was exited.
     */
    readonly hostedChannelName: string | undefined;
    /**
     * The viewer count of the enabled host.
     *
     * null if viewercount is unknown or host mode was exited.
     */
    readonly viewerCount: number | undefined;
    constructor(message: IRCMessageData);
    wasHostModeExited(): this is ExitHostModeHosttargetMessage;
    wasHostModeEntered(): this is ExitedHostModeHosttargetMessage;
}
export interface ExitHostModeHosttargetMessage extends HosttargetMessage {
    readonly hostedChannelName: undefined;
    readonly viewerCount: undefined;
}
export interface ExitedHostModeHosttargetMessage extends HosttargetMessage {
    readonly hostedChannelName: string;
    readonly viewerCount: number | undefined;
}
//# sourceMappingURL=hosttarget.d.ts.map