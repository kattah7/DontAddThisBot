"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLogin = exports.LoginError = void 0;
const await_response_1 = require("../await/await-response");
const errors_1 = require("../client/errors");
const notice_1 = require("../message/twitch-types/notice");
const is_anonymous_username_1 = require("../utils/is-anonymous-username");
class LoginError extends errors_1.ConnectionError {
}
exports.LoginError = LoginError;
async function sendLogin(conn, username, password) {
    if (password != null) {
        if (!(0, is_anonymous_username_1.isAnonymousUsername)(username) && !password.startsWith("oauth:")) {
            // don't append oauth: for the fake passwords that can be sent for
            // anonymous usernames, such as `PASS SCHMOOPIE`
            password = "oauth:" + password;
        }
        conn.sendRaw(`PASS ${password}`);
    }
    conn.sendRaw(`NICK ${username}`);
    // successful login if we're greeted with a 001,
    // e.g. :tmi.twitch.tv 001 justinfan12345 :Welcome, GLHF!
    // some kind of error occurred if the server sends us a NOTICE.
    // e.g. :tmi.twitch.tv NOTICE * :Improperly formatted auth
    // or :tmi.twitch.tv NOTICE * :Login authentication failed
    await (0, await_response_1.awaitResponse)(conn, {
        success: (msg) => msg.ircCommand === "001",
        failure: (msg) => msg instanceof notice_1.NoticeMessage,
        errorType: (message, cause) => new LoginError(message, cause),
        errorMessage: "Failed to login",
    });
}
exports.sendLogin = sendLogin;
//# sourceMappingURL=login.js.map