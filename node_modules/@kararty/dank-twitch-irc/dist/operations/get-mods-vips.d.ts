import { SingleConnection } from "../client/connection";
import { MessageError } from "../client/errors";
export declare class GetUsersError extends MessageError {
    channelName: string;
    type: "mods" | "vips";
    constructor(channelName: string, type: "mods" | "vips", message?: string, cause?: Error);
}
export declare function getMods(conn: SingleConnection, channelName: string): Promise<string[]>;
export declare function getVips(conn: SingleConnection, channelName: string): Promise<string[]>;
//# sourceMappingURL=get-mods-vips.d.ts.map