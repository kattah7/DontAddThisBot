import { Condition } from "../await/await-response";
import { SingleConnection } from "../client/connection";
import { ConnectionError } from "../client/errors";
export declare class CapabilitiesError extends ConnectionError {
}
export declare function acknowledgesCapabilities(requestedCapabilities: string[]): Condition;
export declare function deniedAnyCapability(requestedCapabilities: string[]): Condition;
export declare function requestCapabilities(conn: SingleConnection, requestMembershipCapability: boolean): Promise<void>;
//# sourceMappingURL=request-capabilities.d.ts.map