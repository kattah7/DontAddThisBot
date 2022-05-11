"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helpers_spec_1 = require("../../helpers.spec");
const irc_message_1 = require("../irc/irc-message");
const irc_message_2 = require("./irc-message");
const parse_error_1 = require("./parse-error");
describe("./message/parser/irc-message", function () {
    describe("#parseIRCMessage", function () {
        it("should throw a ParseError on empty string input", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_message_2.parseIRCMessage)(""), parse_error_1.ParseError, 'Invalid format for IRC command (given src: "")');
        });
        it("should throw a ParseError on malformed input", function () {
            // double space
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_message_2.parseIRCMessage)(":tmi.twitch.tv  PRIVMSG"), parse_error_1.ParseError, 'Invalid format for IRC command (given src: ":tmi.twitch.tv  PRIVMSG")');
        });
        it("should error on empty prefix", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_message_2.parseIRCMessage)(": PING xD"), parse_error_1.ParseError, 'Empty prefix declaration (nothing after : sign) (given src: ": PING xD")');
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_message_2.parseIRCMessage)(":a@ PING xD"), parse_error_1.ParseError, 'Host, nick or user is empty in prefix (given src: ":a@ PING xD")');
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_message_2.parseIRCMessage)(":a!@b PING xD"), parse_error_1.ParseError, 'Host, nick or user is empty in prefix (given src: ":a!@b PING xD")');
        });
        it("should parse this one", function () {
            (0, irc_message_2.parseIRCMessage)(":justinfan12345.tmi.twitch.tv 353 justinfan12345 = #pajlada :justinfan12345");
        });
        it("should parse tags optionally", function () {
            const actual = (0, irc_message_2.parseIRCMessage)(":tetyys!tetyys@tetyys.tmi.twitch.tv PRIVMSG #pajlada :KKona");
            const expected = new irc_message_1.IRCMessage({
                rawSource: ":tetyys!tetyys@tetyys.tmi.twitch.tv PRIVMSG #pajlada :KKona",
                ircPrefixRaw: "tetyys!tetyys@tetyys.tmi.twitch.tv",
                ircPrefix: {
                    nickname: "tetyys",
                    username: "tetyys",
                    hostname: "tetyys.tmi.twitch.tv",
                },
                ircCommand: "PRIVMSG",
                ircParameters: ["#pajlada", "KKona"],
                ircTags: {},
            });
            chai_1.assert.deepStrictEqual(actual, expected);
        });
        it("should parse tags", function () {
            const actual = (0, irc_message_2.parseIRCMessage)("@abc=def;kkona=kkona;def;def PONG");
            chai_1.assert.deepStrictEqual(actual, new irc_message_1.IRCMessage({
                rawSource: "@abc=def;kkona=kkona;def;def PONG",
                ircPrefixRaw: undefined,
                ircPrefix: undefined,
                ircCommand: "PONG",
                ircParameters: [],
                ircTags: {
                    abc: "def",
                    kkona: "kkona",
                    def: null,
                },
            }));
        });
        it("should parse prefix optionally", function () {
            const actual = (0, irc_message_2.parseIRCMessage)("PONG :tmi.twitch.tv");
            chai_1.assert.deepStrictEqual(actual, new irc_message_1.IRCMessage({
                rawSource: "PONG :tmi.twitch.tv",
                ircPrefixRaw: undefined,
                ircPrefix: undefined,
                ircCommand: "PONG",
                ircParameters: ["tmi.twitch.tv"],
                ircTags: {},
            }));
        });
        it("should parse multiple middle parameters", function () {
            const actual = (0, irc_message_2.parseIRCMessage)("PONG a b cd");
            chai_1.assert.deepStrictEqual(actual, new irc_message_1.IRCMessage({
                rawSource: "PONG a b cd",
                ircPrefixRaw: undefined,
                ircPrefix: undefined,
                ircCommand: "PONG",
                ircParameters: ["a", "b", "cd"],
                ircTags: {},
            }));
        });
        it('should allow ":" character in middle parameters', function () {
            const actual = (0, irc_message_2.parseIRCMessage)("PONG a:b b: :cd");
            chai_1.assert.deepStrictEqual(actual, new irc_message_1.IRCMessage({
                rawSource: "PONG a:b b: :cd",
                ircPrefixRaw: undefined,
                ircPrefix: undefined,
                ircCommand: "PONG",
                ircParameters: ["a:b", "b:", "cd"],
                ircTags: {},
            }));
        });
        it("should uppercase the command", function () {
            const actual = (0, irc_message_2.parseIRCMessage)("pong");
            chai_1.assert.deepStrictEqual(actual, new irc_message_1.IRCMessage({
                rawSource: "pong",
                ircPrefixRaw: undefined,
                ircPrefix: undefined,
                ircCommand: "PONG",
                ircParameters: [],
                ircTags: {},
            }));
        });
        it("should recognize host-only prefixes", function () {
            const actual = (0, irc_message_2.parseIRCMessage)(":tmi.twitch.tv PING");
            chai_1.assert.deepStrictEqual(actual, new irc_message_1.IRCMessage({
                rawSource: ":tmi.twitch.tv PING",
                ircPrefixRaw: "tmi.twitch.tv",
                ircPrefix: {
                    nickname: undefined,
                    username: undefined,
                    hostname: "tmi.twitch.tv",
                },
                ircCommand: "PING",
                ircParameters: [],
                ircTags: {},
            }));
        });
        it("should recognize server-only prefixes", function () {
            const actual = (0, irc_message_2.parseIRCMessage)(":leppunen PRIVMSG");
            // note: this could also be a nickname-only prefix but those
            // don't really exist on Twitch so we assume a :<single thing>
            // prefix to be a hostname regardless of content
            chai_1.assert.deepStrictEqual(actual, new irc_message_1.IRCMessage({
                rawSource: ":leppunen PRIVMSG",
                ircPrefixRaw: "leppunen",
                ircPrefix: {
                    nickname: undefined,
                    username: undefined,
                    hostname: "leppunen",
                },
                ircCommand: "PRIVMSG",
                ircParameters: [],
                ircTags: {},
            }));
        });
        it("should recognize full prefixes", function () {
            const actual = (0, irc_message_2.parseIRCMessage)(":leppunen!crazyusername@local.host PRIVMSG");
            chai_1.assert.deepStrictEqual(actual, new irc_message_1.IRCMessage({
                rawSource: ":leppunen!crazyusername@local.host PRIVMSG",
                ircPrefixRaw: "leppunen!crazyusername@local.host",
                ircPrefix: {
                    nickname: "leppunen",
                    username: "crazyusername",
                    hostname: "local.host",
                },
                ircCommand: "PRIVMSG",
                ircParameters: [],
                ircTags: {},
            }));
        });
        it("should allow numeric commands", function () {
            const actual = (0, irc_message_2.parseIRCMessage)("001");
            chai_1.assert.deepStrictEqual(actual, new irc_message_1.IRCMessage({
                rawSource: "001",
                ircPrefixRaw: undefined,
                ircPrefix: undefined,
                ircCommand: "001",
                ircParameters: [],
                ircTags: {},
            }));
        });
        it("should only allow 3-digit numeric commands", function () {
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_message_2.parseIRCMessage)("01"), parse_error_1.ParseError, 'Invalid format for IRC command (given src: "01")');
            (0, helpers_spec_1.assertThrowsChain)(() => (0, irc_message_2.parseIRCMessage)("0001"), parse_error_1.ParseError, 'Invalid format for IRC command (given src: "0001")');
        });
    });
    it("should allow underscores in usernames", function () {
        const actual = (0, irc_message_2.parseIRCMessage)("@historical=1;badge-info=subscriber/4;" +
            "badges=subscriber/3,sub-gifter/1;color=#492F2F;" +
            "display-name=Billy_Bones_U;emotes=;flags=;id=d3805a32-df90-4844-a3ab" +
            "-4ea116fcf1c6;mod=0;room-id=11148817;subscriber=1;tmi-sent-ts=15656850" +
            "67248;turbo=0;user-id=411604091;user-type= :billy_bones_u!billy_bones_" +
            "u@billy_bones_u.tmi.twitch.tv PRIVMSG #pajlada :FeelsDankMan ...");
        chai_1.assert.deepStrictEqual(actual, new irc_message_1.IRCMessage({
            rawSource: "@historical=1;badge-info=subscriber/4;" +
                "badges=subscriber/3,sub-gifter/1;color=#492F2F;" +
                "display-name=Billy_Bones_U;emotes=;flags=;id=d3805a32-df90-4844-a3ab" +
                "-4ea116fcf1c6;mod=0;room-id=11148817;subscriber=1;tmi-sent-ts=15656850" +
                "67248;turbo=0;user-id=411604091;user-type= :billy_bones_u!billy_bones_" +
                "u@billy_bones_u.tmi.twitch.tv PRIVMSG #pajlada :FeelsDankMan ...",
            ircPrefixRaw: "billy_bones_u!billy_bones_u@billy_bones_u.tmi.twitch.tv",
            ircPrefix: {
                hostname: "billy_bones_u.tmi.twitch.tv",
                nickname: "billy_bones_u",
                username: "billy_bones_u",
            },
            ircParameters: ["#pajlada", "FeelsDankMan ..."],
            ircCommand: "PRIVMSG",
            ircTags: {
                "historical": "1",
                "badge-info": "subscriber/4",
                "badges": "subscriber/3,sub-gifter/1",
                "color": "#492F2F",
                "display-name": "Billy_Bones_U",
                "emotes": "",
                "flags": "",
                "id": "d3805a32-df90-4844-a3ab-4ea116fcf1c6",
                "mod": "0",
                "room-id": "11148817",
                "subscriber": "1",
                "tmi-sent-ts": "1565685067248",
                "turbo": "0",
                "user-id": "411604091",
                "user-type": "",
            },
        }));
    });
});
//# sourceMappingURL=irc-message.spec.js.map