/// <reference types="node" />
import { Duplex } from "stream";
export interface Transport {
    readonly stream: Duplex;
    connect(connectionListener?: () => void): void;
}
//# sourceMappingURL=transport.d.ts.map