"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAnonymousUsername = void 0;
const anonymousUsernameRegex = /^justinfan\d+$/;
function isAnonymousUsername(username) {
    return anonymousUsernameRegex.test(username);
}
exports.isAnonymousUsername = isAnonymousUsername;
//# sourceMappingURL=is-anonymous-username.js.map