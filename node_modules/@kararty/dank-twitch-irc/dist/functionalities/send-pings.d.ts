import { SingleConnection } from "../client/connection";
export interface ClientPingConfig {
    /**
     * send interval in milliseconds
     */
    interval: number;
    /**
     * timeout in milliseconds
     */
    timeout: number;
}
export declare function sendClientPings(conn: SingleConnection, config?: Partial<ClientPingConfig>): void;
//# sourceMappingURL=send-pings.d.ts.map