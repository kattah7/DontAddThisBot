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
        const user = await utils.ParseUser(args[0] ?? message.senderUsername);
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
            const messages = JSON.parse(body)[0].data.channel.modLogs.messagesBySender.edges
            total += messages.length;
            if (messages.length !== 50) {
                const msg = messages.slice(-1)[0].node
                    const tmiData = []
                    for (const xd of messages) {
                        const text = xd.node.content?.text
                        if (!text) { continue }
                        const tags = {
                            id: xd.node.id,
                            badges: xd.node.sender.displayBadges.map(b => `${b.setID}/${b.version}`).join(),
                            color: xd.node.sender.chatColor,
                            'display-name': xd.node.sender.displayName,
                            'rm-received-ts': Date.parse(xd.node.sentAt)
                        }
                        const rawTags = Object.entries(tags).map(([k, v]) => `${k}=${v}`).join(';')
                        tmiData.push(`@${rawTags} :${xd.node.sender.login} PRIVMSG #${message.channelName} :${text}`)
                        const paste = await got.post('https://paste.ivr.fi/documents', { body: tmiData.reverse().join('\n') }).json()
                        client.say(message.channelName, `${user} has sent ${total} messages. Their first message in this channel was ${xd.node.sentAt.split("T")[0]} ago: "${xd.node.content.text}" More info => https://logs.raccatta.cc/?url=https://paste.ivr.fi/raw/${paste.key}?reverse`);
                    }
                    
            } else if (messages.slice(-1).pop().cursor) {
                fetchMessages(messages.slice(-1).pop().cursor);
            } 
        };

        fetchMessages();
        return {
            text: `Fetching... ppCircle this will take a while`,
        };
    },
};