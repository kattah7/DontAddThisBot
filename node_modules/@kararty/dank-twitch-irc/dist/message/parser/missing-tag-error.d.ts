import { MissingDataError } from "./missing-data-error";
export declare class MissingTagError extends MissingDataError {
    tagKey: string;
    actualValue: string | null | undefined;
    constructor(tagKey: string, actualValue: string | null | undefined, cause?: Error);
}
//# sourceMappingURL=missing-tag-error.d.ts.map