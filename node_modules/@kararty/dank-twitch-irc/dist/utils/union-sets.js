"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unionSets = void 0;
function unionSets(sets) {
    const newSet = new Set();
    for (const set of sets) {
        for (const element of set) {
            newSet.add(element);
        }
    }
    return newSet;
}
exports.unionSets = unionSets;
//# sourceMappingURL=union-sets.js.map