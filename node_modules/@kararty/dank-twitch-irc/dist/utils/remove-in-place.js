"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeInPlace = void 0;
function removeInPlace(arr, element) {
    let index;
    while ((index = arr.indexOf(element)) !== -1) {
        arr.splice(index, 1);
    }
}
exports.removeInPlace = removeInPlace;
//# sourceMappingURL=remove-in-place.js.map