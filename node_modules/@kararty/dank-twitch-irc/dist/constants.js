"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_OUTGOING_COMMAND_LENGTH = exports.MAX_OUTGOING_LINE_LENGTH = void 0;
/**
 * Maximum line length (including CR LF) the twitch server will accept before
 * chopping the rest off
 */
exports.MAX_OUTGOING_LINE_LENGTH = 4096;
/**
 * Maximum command length (excluding CR LF) the twitch server will accept before
 * chopping the rest off
 */
exports.MAX_OUTGOING_COMMAND_LENGTH = exports.MAX_OUTGOING_LINE_LENGTH - 2;
//# sourceMappingURL=constants.js.map