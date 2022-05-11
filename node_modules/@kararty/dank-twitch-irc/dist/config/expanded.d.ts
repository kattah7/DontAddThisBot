import { ClientConfiguration, DuplexTransportConfiguration, RateLimitsConfig, TcpTransportConfiguration, TransportConfiguration, WebSocketTransportConfiguration } from "./config";
import { MessageRateLimits } from "./message-rate-limits";
export declare type ExpandedDuplexTransportConfiguration = Required<DuplexTransportConfiguration>;
export declare type ExpandedTcpTransportConfiguration = Required<TcpTransportConfiguration> & {
    preSetup: false;
};
export declare type ExpandedWebSocketTransportConfiguration = WebSocketTransportConfiguration & {
    preSetup: false;
};
export declare type ExpandedTransportConfiguration = ExpandedDuplexTransportConfiguration | ExpandedTcpTransportConfiguration | ExpandedWebSocketTransportConfiguration;
export declare type ExpandedClientConfiguration = Required<Omit<ClientConfiguration, "connection" | "password" | "rateLimits">> & {
    password: string | undefined;
    connection: ExpandedTransportConfiguration;
    rateLimits: MessageRateLimits;
};
export declare function expandTransportConfig(config: TransportConfiguration | undefined): ExpandedTransportConfiguration;
export declare function expandRateLimitsConfig(config: RateLimitsConfig | undefined): MessageRateLimits;
export declare function expandConfig(config?: ClientConfiguration): ExpandedClientConfiguration;
//# sourceMappingURL=expanded.d.ts.map