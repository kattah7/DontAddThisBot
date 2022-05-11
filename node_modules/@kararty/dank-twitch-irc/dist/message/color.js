"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorToHexString = void 0;
function toPaddedHex(i, shouldBeLength) {
    const s = i.toString(16);
    return "0".repeat(shouldBeLength - s.length) + s;
}
/**
 * Make a hexadecimal color string (like e.g. #AABBCC) from a given color object.
 */
function colorToHexString(color) {
    return ("#" +
        toPaddedHex(color.r, 2) +
        toPaddedHex(color.g, 2) +
        toPaddedHex(color.b, 2));
}
exports.colorToHexString = colorToHexString;
//# sourceMappingURL=color.js.map