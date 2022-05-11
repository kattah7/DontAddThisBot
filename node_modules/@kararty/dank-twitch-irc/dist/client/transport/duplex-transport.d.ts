/// <reference types="node" />
import { Duplex } from "stream";
import { ExpandedDuplexTransportConfiguration } from "../../config/expanded";
import { Transport } from "./transport";
export declare class DuplexTransport implements Transport {
    readonly stream: Duplex;
    constructor(config: ExpandedDuplexTransportConfiguration);
    connect(connectionListener?: () => void): void;
}
//# sourceMappingURL=duplex-transport.d.ts.map