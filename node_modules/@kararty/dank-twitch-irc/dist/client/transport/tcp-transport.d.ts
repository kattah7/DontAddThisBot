/// <reference types="node" />
import { Socket } from "net";
import { TLSSocket } from "tls";
import { ExpandedTcpTransportConfiguration } from "../../config/expanded";
import { Transport } from "./transport";
export declare class TcpTransport implements Transport {
    readonly stream: Socket | TLSSocket;
    private readonly backingSocket?;
    private readonly config;
    constructor(config: ExpandedTcpTransportConfiguration);
    connect(connectionListener?: () => void): void;
}
//# sourceMappingURL=tcp-transport.d.ts.map