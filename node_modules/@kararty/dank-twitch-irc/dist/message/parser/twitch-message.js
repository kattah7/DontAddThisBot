"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTwitchMessage = exports.commandClassMap = void 0;
const cap_1 = require("../twitch-types/cap");
const clearchat_1 = require("../twitch-types/clearchat");
const clearmsg_1 = require("../twitch-types/clearmsg");
const ping_1 = require("../twitch-types/connection/ping");
const pong_1 = require("../twitch-types/connection/pong");
const reconnect_1 = require("../twitch-types/connection/reconnect");
const globaluserstate_1 = require("../twitch-types/globaluserstate");
const hosttarget_1 = require("../twitch-types/hosttarget");
const join_1 = require("../twitch-types/membership/join");
const part_1 = require("../twitch-types/membership/part");
const notice_1 = require("../twitch-types/notice");
const privmsg_1 = require("../twitch-types/privmsg");
const roomstate_1 = require("../twitch-types/roomstate");
const usernotice_1 = require("../twitch-types/usernotice");
const userstate_1 = require("../twitch-types/userstate");
const whisper_1 = require("../twitch-types/whisper");
const irc_message_1 = require("./irc-message");
// import { T } from 'ts-toolbelt';
// export const list = [
//    ClearchatMessage,
//    ClearmsgMessage,
//    GlobaluserstateMessage,
//    HosttargetMessage,
//    NoticeMessage,
//    PrivmsgMessage,
//    RoomstateMessage,
//    UsernoticeMessage,
//    UserstateMessage,
//    WhisperMessage,
//    JoinMessage,
//    PartMessage,
//    ReconnectMessage,
//    PingMessage,
//    PongMessage
// ] as const;
//
// type x = typeof list;
// type Commands = { [K in Exclude<keyof x, keyof any[]>]: x[K]['command'] } & { length: x['length'] } & any[];
// type Instances = { [K in Exclude<keyof x, keyof any[]>]: x[K] } & { length: x['length'] } & any[];
// type Map = T.ZipObj<Commands, x>;
exports.commandClassMap = {
    CLEARCHAT: clearchat_1.ClearchatMessage,
    CLEARMSG: clearmsg_1.ClearmsgMessage,
    GLOBALUSERSTATE: globaluserstate_1.GlobaluserstateMessage,
    HOSTTARGET: hosttarget_1.HosttargetMessage,
    NOTICE: notice_1.NoticeMessage,
    PRIVMSG: privmsg_1.PrivmsgMessage,
    ROOMSTATE: roomstate_1.RoomstateMessage,
    USERNOTICE: usernotice_1.UsernoticeMessage,
    USERSTATE: userstate_1.UserstateMessage,
    WHISPER: whisper_1.WhisperMessage,
    JOIN: join_1.JoinMessage,
    PART: part_1.PartMessage,
    RECONNECT: reconnect_1.ReconnectMessage,
    PING: ping_1.PingMessage,
    PONG: pong_1.PongMessage,
    CAP: cap_1.CapMessage,
};
function parseTwitchMessage(messageSrc) {
    const ircMessage = (0, irc_message_1.parseIRCMessage)(messageSrc);
    const constructor = exports.commandClassMap[ircMessage.ircCommand];
    if (constructor == null) {
        return ircMessage;
    }
    else {
        return new constructor(ircMessage);
    }
}
exports.parseTwitchMessage = parseTwitchMessage;
//# sourceMappingURL=twitch-message.js.map