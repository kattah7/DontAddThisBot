"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIntThrowing = void 0;
const parse_error_1 = require("./parse-error");
function parseIntThrowing(str) {
    if (str == null) {
        throw new parse_error_1.ParseError("String source for integer is null/undefined");
    }
    const parsedInt = parseInt(str);
    if (isNaN(parsedInt)) {
        throw new parse_error_1.ParseError(`Invalid integer for string "${str}"`);
    }
    return parsedInt;
}
exports.parseIntThrowing = parseIntThrowing;
//# sourceMappingURL=common.js.map