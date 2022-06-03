module.exports = {
    name: "DontAddThisBot",
    cooldown: 3000,
    description: "bot info",
    aliases: ["datb", "dontaddthisbot"],
    poro: true,
    execute: async(message, args, client) => {
        if (message.senderUsername == process.env.NUMBER_ONE) {
            return client.privmsg(message.channelName, `.me DontAddThisBot is a multi-channel variety and utility bot made by @Kattah`)
        } else {
            return {
                text: `DontAddThisBot is a multi-channel variety and utility bot made by @Kattah`
            }
        }
    }
}