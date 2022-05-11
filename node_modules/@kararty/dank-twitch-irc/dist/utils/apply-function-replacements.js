"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyReplacements = exports.applyReplacement = void 0;
function applyReplacement(self, target, key, newFn) {
    const oldFn = Reflect.get(target, key);
    // build a new replacement function that is called instead of
    // the original function
    // it then purely delegates to "newFn", except the first parameter
    // is additionally the old function.
    function replacementFn(...args) {
        // @ts-ignore complains that `args` does not have a '[Symbol.iterator]()' method that returns an iterator
        return newFn.call(self, oldFn.bind(this), ...args);
    }
    // define the new fn as not enumerable
    Object.defineProperty(target, key, {
        value: replacementFn,
        writable: true,
        enumerable: false,
        configurable: true,
    });
}
exports.applyReplacement = applyReplacement;
function applyReplacements(self, target, replacements) {
    for (const [key, newFn] of Object.entries(replacements)) {
        applyReplacement(self, target, key, newFn);
    }
}
exports.applyReplacements = applyReplacements;
//# sourceMappingURL=apply-function-replacements.js.map