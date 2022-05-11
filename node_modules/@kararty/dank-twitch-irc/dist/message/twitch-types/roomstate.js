"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomstateMessage = exports.hasAllStateTags = void 0;
const pickBy = require("lodash.pickby");
const channel_irc_message_1 = require("../irc/channel-irc-message");
const tag_values_1 = require("../parser/tag-values");
function hasAllStateTags(partialRoomState) {
    return (partialRoomState.emoteOnly != null &&
        partialRoomState.followersOnlyDuration != null &&
        partialRoomState.r9k != null &&
        partialRoomState.slowModeDuration != null &&
        partialRoomState.subscribersOnly != null);
}
exports.hasAllStateTags = hasAllStateTags;
class RoomstateMessage extends channel_irc_message_1.ChannelIRCMessage {
    channelID;
    emoteOnly;
    emoteOnlyRaw;
    followersOnlyDuration;
    followersOnlyDurationRaw;
    r9k;
    r9kRaw;
    slowModeDuration;
    slowModeDurationRaw;
    subscribersOnly;
    subscribersOnlyRaw;
    constructor(message) {
        super(message);
        const tagParser = (0, tag_values_1.tagParserFor)(this.ircTags);
        this.channelID = tagParser.requireString("room-id");
        this.emoteOnly = tagParser.getBoolean("emote-only");
        this.emoteOnlyRaw = tagParser.getString("emote-only");
        this.followersOnlyDuration = tagParser.getInt("followers-only");
        this.followersOnlyDurationRaw = tagParser.getString("followers-only");
        this.r9k = tagParser.getBoolean("r9k");
        this.r9kRaw = tagParser.getString("r9k");
        this.slowModeDuration = tagParser.getInt("slow");
        this.slowModeDurationRaw = tagParser.getString("slow");
        this.subscribersOnly = tagParser.getBoolean("subs-only");
        this.subscribersOnlyRaw = tagParser.getString("subs-only");
    }
    extractRoomState() {
        // this object has "undefined" mapped for missing properties,
        // but we want to return an object where those keys are not
        // even present.
        const fullObj = {
            emoteOnly: this.emoteOnly,
            emoteOnlyRaw: this.emoteOnlyRaw,
            followersOnlyDuration: this.followersOnlyDuration,
            followersOnlyDurationRaw: this.followersOnlyDurationRaw,
            r9k: this.r9k,
            r9kRaw: this.r9kRaw,
            slowModeDuration: this.slowModeDuration,
            slowModeDurationRaw: this.slowModeDurationRaw,
            subscribersOnly: this.subscribersOnly,
            subscribersOnlyRaw: this.subscribersOnlyRaw,
        };
        return pickBy(fullObj, (v) => v != null);
    }
}
exports.RoomstateMessage = RoomstateMessage;
//# sourceMappingURL=roomstate.js.map