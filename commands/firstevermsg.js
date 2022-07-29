const got = require("got");
const utils = require("../util/utils.js");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "fetchfirstmessage",
    aliases: ["ffm"],
    cooldown: 3000,
    botPerms: "mod",
    level: 3,
    execute: async (message, args, client) => {
        const user = args[0] ?? message.senderUsername;
        const userid = await utils.IDByLogin(user);

        let total = 0;
        const fetchMessages = async (cursor) => {
            const { body } = await got.post(`https://gql.twitch.tv/gql`, {
                headers: {
                    "Client-ID": process.env.CLIENT_ID_FOR_GQL,
                    Authorization: `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([
                    {
                        operationName: "ViewerCardModLogsMessagesBySender",
                        variables: {
                            senderID: userid,
                            channelLogin: message.channelName,
                            cursor,
                        },
                        extensions: {
                            persistedQuery: {
                                version: 1,
                                sha256Hash: "437f209626e6536555a08930f910274528a8dea7e6ccfbef0ce76d6721c5d0e7",
                            },
                        },
                    },
                ]),
            });

            console.log(JSON.parse(body)[0].data.channel.modLogs.messagesBySender.edges);
            const messages = JSON.parse(body)[0].data.channel.modLogs.messagesBySender.edges;
            total += messages.length;
            if (messages.length !== 50) {
                const msg = messages.slice(-1)[0].node;
                console.log(msg);
                client.say(message.channelName, `${user} has sent ${total} messages. Their first message in this channel was ${msg.sentAt.split("T")[0]} ago: "${msg.content.text}"`);
            }
            if (messages.slice(-1).pop().cursor) {
                fetchMessages(messages.slice(-1).pop().cursor);
            }
        };

        fetchMessages();
        return {
            text: `Fetching... ppCircle this will take a while`,
        };
    },
};