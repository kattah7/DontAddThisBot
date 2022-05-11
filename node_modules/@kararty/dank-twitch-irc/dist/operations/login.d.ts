import { SingleConnection } from "../client/connection";
import { ConnectionError } from "../client/errors";
export declare class LoginError extends ConnectionError {
}
export declare function sendLogin(conn: SingleConnection, username: string, password?: string): Promise<void>;
//# sourceMappingURL=login.d.ts.map