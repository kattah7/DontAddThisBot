"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinAll = void 0;
const constants_1 = require("../constants");
const split_into_chunks_1 = require("../utils/split-into-chunks");
const join_1 = require("./join");
async function joinAll(conn, channelNames) {
    // e.g. "JOIN #firstchannel,#secondchannel,#thirdchannel"
    // joining channels this way is much faster than sending individual JOIN commands
    // the twitch server cuts off messages at 4096 characters so we produce chunks of that size
    channelNames.forEach((channelName) => conn.wantedChannels.add(channelName));
    const channelChunks = (0, split_into_chunks_1.splitIntoChunks)(channelNames.map((e) => `#${e}`), ",", constants_1.MAX_OUTGOING_COMMAND_LENGTH - "JOIN ".length);
    const resultsMap = {};
    for (const chunk of channelChunks) {
        conn.sendRaw(`JOIN ${chunk.join(",")}`);
        const chunkNames = chunk.map((s) => s.slice(1));
        const chunkPromises = [];
        // we await the joining of all channels of this chunk in parallel
        for (const channelName of chunkNames) {
            chunkPromises.push((0, join_1.awaitJoinResponse)(conn, channelName).then(() => {
                // on success
                conn.joinedChannels.add(channelName);
                resultsMap[channelName] = undefined;
            }, (error) => {
                // on failure
                resultsMap[channelName] = error;
            }));
        }
        await Promise.all(chunkPromises);
    }
    return resultsMap;
}
exports.joinAll = joinAll;
//# sourceMappingURL=join-all.js.map