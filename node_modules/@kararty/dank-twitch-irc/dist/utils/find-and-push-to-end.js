"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAndPushToEnd = void 0;
function findByPredicate(arr, filter) {
    for (const [index, value] of arr.entries()) {
        if (filter(value)) {
            return { index, value };
        }
    }
    return undefined;
}
function findAndPushToEnd(arr, filter) {
    const result = findByPredicate(arr, filter);
    if (result == null) {
        return undefined;
    }
    const { index, value } = result;
    arr.splice(index, 1);
    arr.push(value);
    return value;
}
exports.findAndPushToEnd = findAndPushToEnd;
//# sourceMappingURL=find-and-push-to-end.js.map