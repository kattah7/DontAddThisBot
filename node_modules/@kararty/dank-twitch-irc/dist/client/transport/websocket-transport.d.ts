import { Duplexify } from "duplexify";
import { ExpandedWebSocketTransportConfiguration } from "../../config/expanded";
import { Transport } from "./transport";
export declare class WebSocketTransport implements Transport {
    readonly stream: Duplexify;
    private readonly readable;
    private readonly writable;
    private readonly config;
    private wsStream;
    constructor(config: ExpandedWebSocketTransportConfiguration);
    connect(connectionListener?: () => void): void;
}
//# sourceMappingURL=websocket-transport.d.ts.map