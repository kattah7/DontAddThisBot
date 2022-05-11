import { EventEmitter } from "eventemitter3";
import { ClientConfiguration } from "../config/config";
import { ExpandedClientConfiguration } from "../config/expanded";
import { IRCMessage } from "../message/irc/irc-message";
import { ClientEvents, ClientState } from "./interface";
export declare abstract class BaseClient extends EventEmitter<ClientEvents> {
    get unconnected(): boolean;
    get connecting(): boolean;
    get connected(): boolean;
    get ready(): boolean;
    get closed(): boolean;
    readonly configuration: ExpandedClientConfiguration;
    abstract readonly wantedChannels: Set<string>;
    abstract readonly joinedChannels: Set<string>;
    state: ClientState;
    protected constructor(partialConfig?: ClientConfiguration);
    emitError(error: Error, emitEvenIfClosed?: boolean): void;
    emitMessage(message: IRCMessage): void;
    emitConnecting(): void;
    emitConnected(): void;
    emitReady(): void;
    emitClosed(error?: Error): void;
    advanceState(newState: ClientState): boolean;
}
//# sourceMappingURL=base-client.d.ts.map