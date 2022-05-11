import { TwitchBadgesList } from "../badges";
import { Color } from "../color";
import { TwitchEmoteList } from "../emotes";
import { IRCMessage } from "../irc/irc-message";
export declare class WhisperMessage extends IRCMessage {
    readonly messageText: string;
    readonly senderUsername: string;
    readonly senderUserID: string;
    readonly recipientUsername: string;
    readonly badges: TwitchBadgesList;
    readonly badgesRaw: string;
    readonly color: Color | undefined;
    readonly colorRaw: string;
    readonly displayName: string;
    readonly emotes: TwitchEmoteList;
    readonly emotesRaw: string;
    readonly messageID: string;
    readonly threadID: string;
    constructor(ircMessage: IRCMessage);
}
//# sourceMappingURL=whisper.d.ts.map