import { SingleConnection } from "../client/connection";
import { MessageError } from "../client/errors";
import { Color } from "../message/color";
export declare class SetColorError extends MessageError {
    wantedColor: Color;
    constructor(wantedColor: Color, message?: string, cause?: Error);
}
export declare function setColor(conn: SingleConnection, color: Color): Promise<void>;
//# sourceMappingURL=set-color.d.ts.map