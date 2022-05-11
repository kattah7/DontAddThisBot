/// <reference types="node" />
import "clarify";
import { Duplex } from "stream";
import { ChatClient } from "./client/client";
import { SingleConnection } from "./client/connection";
export declare function errorOf(p: Promise<any>): Promise<any>;
export declare function causeOf(p: Promise<any>): Promise<any>;
export declare function assertErrorChain(p: Promise<any> | Promise<any>[], ...chain: any[]): Promise<void>;
export declare function assertErrorChain(e: Error | undefined, ...chain: any[]): void;
export declare function assertThrowsChain(f: () => void, ...chain: any[]): void;
export declare type MockTransportData = {
    transport: Duplex;
    data: any[];
    emit: (...lines: string[]) => void;
    end: (error?: Error) => void;
    emitAndEnd: (...lines: string[]) => void;
};
export declare function createMockTransport(): MockTransportData;
export declare type FakeConnectionData = {
    client: SingleConnection;
    clientError: Promise<void>;
} & MockTransportData;
export declare function fakeConnection(): FakeConnectionData;
export declare type FakeClientData = {
    client: ChatClient;
    clientError: Promise<void>;
    transports: MockTransportData[];
    emit: (...lines: string[]) => void;
    end: () => void;
    emitAndEnd: (...lines: string[]) => void;
};
export declare function fakeClient(connect?: boolean): FakeClientData;
//# sourceMappingURL=helpers.spec.d.ts.map