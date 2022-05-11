"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseColor = void 0;
const parse_error_1 = require("./parse-error");
const rgbColorRegex = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
function parseColor(colorSrc) {
    const match = rgbColorRegex.exec(colorSrc);
    if (match == null) {
        throw new parse_error_1.ParseError(`Malformed color value "${colorSrc}", must be in format #AABBCC`);
    }
    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    return { r, g, b };
}
exports.parseColor = parseColor;
//# sourceMappingURL=color.js.map