import { IRCMessage } from "../message/irc/irc-message";
import { TwitchCommands } from "../message/parser/twitch-message";
import { SingleConnection } from "./connection";
export declare enum ClientState {
    UNCONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2,
    READY = 3,
    CLOSED = 4
}
export interface ClientStateChangeEvent {
    oldState: ClientState;
    newState: ClientState;
}
export interface SpecificConnectionEvents {
    connecting: [];
    connect: [];
    ready: [];
    close: [Error | undefined];
    error: [Error];
    message: [IRCMessage];
}
export interface SpecificClientEvents {
    connecting: [];
    connect: [];
    ready: [];
    close: [Error | undefined];
    error: [Error];
    message: [IRCMessage];
    reconnect: [SingleConnection];
    rawCommmand: [string];
}
export declare type TwitchMessageEvents = {
    [P in keyof TwitchCommands]: [InstanceType<TwitchCommands[P]>];
};
export interface IRCMessageEvents {
    [command: string]: [IRCMessage];
}
export declare type ClientEvents = SpecificClientEvents & TwitchMessageEvents & IRCMessageEvents;
//# sourceMappingURL=interface.d.ts.map