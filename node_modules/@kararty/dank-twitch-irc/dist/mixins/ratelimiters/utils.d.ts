import { UserState } from "../../message/twitch-types/userstate";
import { UserStateTracker } from "../userstate-tracker";
interface FastSpamResult {
    fastSpam: boolean;
    certain: boolean;
}
export declare function canSpamFast(channelName: string, loggedInUsername: string, userStateTracker?: UserStateTracker): FastSpamResult;
export declare function canSpamFast(channelName: string, loggedInUsername: string, userState: UserState): FastSpamResult;
export {};
//# sourceMappingURL=utils.d.ts.map