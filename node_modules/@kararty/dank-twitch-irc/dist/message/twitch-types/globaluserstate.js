"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobaluserstateMessage = void 0;
const irc_message_1 = require("../irc/irc-message");
const tag_values_1 = require("../parser/tag-values");
class GlobaluserstateMessage extends irc_message_1.IRCMessage {
    badgeInfo;
    badgeInfoRaw;
    badges;
    badgesRaw;
    color;
    colorRaw;
    displayName;
    emoteSets;
    emoteSetsRaw;
    userID;
    constructor(message) {
        super(message);
        const tagParser = (0, tag_values_1.tagParserFor)(this.ircTags);
        this.badgeInfo = tagParser.requireBadges("badge-info");
        this.badgeInfoRaw = tagParser.requireString("badge-info");
        this.badges = tagParser.requireBadges("badges");
        this.badgesRaw = tagParser.requireString("badges");
        this.color = tagParser.getColor("color");
        this.colorRaw = tagParser.requireString("color");
        // trim: Twitch workaround for unsanitized data, see https://github.com/robotty/dank-twitch-irc/issues/33
        this.displayName = tagParser.requireString("display-name").trim();
        this.emoteSets = tagParser.requireEmoteSets("emote-sets");
        this.emoteSetsRaw = tagParser.requireString("emote-sets");
        this.userID = tagParser.requireString("user-id");
    }
    /**
     * Extracts a plain object only containing the fields defined by the
     * {@link GlobalUserState} interface.
     */
    extractGlobalUserState() {
        return {
            badgeInfo: this.badgeInfo,
            badgeInfoRaw: this.badgeInfoRaw,
            badges: this.badges,
            badgesRaw: this.badgesRaw,
            color: this.color,
            colorRaw: this.colorRaw,
            displayName: this.displayName,
            emoteSets: this.emoteSets,
            emoteSetsRaw: this.emoteSetsRaw,
            userID: this.userID,
        };
    }
}
exports.GlobaluserstateMessage = GlobaluserstateMessage;
//# sourceMappingURL=globaluserstate.js.map