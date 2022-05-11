import { TwitchBadgesList } from "../badges";
import { Color } from "../color";
import { TwitchEmoteList } from "../emotes";
import { TwitchFlagList } from "../flags";
import { IRCMessageTags } from "../irc/tags";
import { TwitchEmoteSets } from "./emote-sets";
export declare function requireData<V, A extends any[]>(ircTags: IRCMessageTags, key: string, converter: (value: string, ...converterArgs: A) => V | undefined, ...converterArgs: A): V;
export declare function getData<V, A extends any[]>(ircTags: IRCMessageTags, key: string, converter: (value: string, ...converterArgs: A) => V, ...converterArgs: A): V | undefined;
export declare function convertToString(value: string): string;
export declare function convertToInt(value: string): number;
export declare function convertToBoolean(value: string): boolean;
export declare function convertToColor(value: string): Color | undefined;
export declare function convertToTimestamp(value: string): Date;
export declare function convertToBadges(value: string): TwitchBadgesList;
export declare function convertToEmotes(value: string, messageText: string): TwitchEmoteList;
export declare function convertToEmoteSets(value: string): TwitchEmoteSets;
export declare function convertToFlags(value: string, messageText: string): TwitchFlagList;
export interface TagValueParser {
    getString(key: string): string | undefined;
    requireString(key: string): string;
    getInt(key: string): number | undefined;
    requireInt(key: string): number;
    getBoolean(key: string): boolean | undefined;
    requireBoolean(key: string): boolean;
    getColor(key: string): Color | undefined;
    requireColor(key: string): Color;
    getTimestamp(key: string): Date | undefined;
    requireTimestamp(key: string): Date;
    getBadges(key: string): TwitchBadgesList | undefined;
    requireBadges(key: string): TwitchBadgesList;
    getEmotes(key: string, messageText: string): TwitchEmoteList | undefined;
    requireEmotes(key: string, messageText: string): TwitchEmoteList;
    getEmoteSets(key: string): TwitchEmoteSets | undefined;
    requireEmoteSets(key: string): TwitchEmoteSets;
    getFlags(key: string, messageText: string): TwitchFlagList | undefined;
}
export declare function tagParserFor(ircTags: IRCMessageTags): TagValueParser;
//# sourceMappingURL=tag-values.d.ts.map