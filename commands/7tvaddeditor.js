const utils = require("../util/utils.js");

module.exports = {
    name: '7tveditor',
    description: 'Usage: |editor add/remove <username>',
    aliases: ["editor"],
    cooldown: 3000,
    permission: 2,
    async execute(message, args, client) {
        if (!args[0]) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me Usage: |editor add/remove <username>`)
            } else {
                return {
                    text: "Usage: |editor add/remove <username>",
                };
            }
        }
        if (args[0] !== "add" && args[0] !== "remove") {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me Usage: |editor add/remove <username>`)
            } else {
                return {
                    text: "Usage: |editor add/remove <username>",
                };
            }
        }
        if (args[1] == message.channelName) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me You can't add yourself to the editor list!`)
            } else {
                return {
                    text: "You can't add yourself to the editor list!",
                };
            }
        }
        const uid = await utils.IDByLogin(await utils.ParseUser(args[1].toLowerCase()));
        if (uid == null) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me Could not find user "${args[1].toLowerCase()}"`)
            } else {
                return {
                    text: `Could not find user "${args[1].toLowerCase()}"`,
                };
            }
        }
        if (args[0] == 'add') {
        const channel = await bot.DB.channels.findOne({ username: message.channelName }).exec();
        const tc = channel.editors.find(badge => badge.id === uid);
            if (tc) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    return client.privmsg(message.channelName, `.me User "${args[1].toLowerCase()}" is already an editor...`)
                } else {
                    return {
                        text: `User "${args[1].toLowerCase()}" is already an editor...`,
                    };
                }
            } else {
                await bot.DB.channels.updateOne({ username: message.channelName },  {$addToSet:{ editors:   [{ username: await utils.ParseUser(args[1].toLowerCase()), id: uid, grantedAt: new Date()  }] }} ).exec();
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    return client.privmsg(message.channelName, `.me Added "${args[1].toLowerCase()}" as an editor in this channel!`)
                } else {
                    return {
                        text: `Added "${args[1].toLowerCase()}" as an editor in this channel!`,
                    }
                }
            }
        }
        if (args[0] == 'remove') {
            const channel = await bot.DB.channels.findOne({ username: message.channelName }).exec();
            const tc = channel.editors.find(badge => badge.id === uid);
            if (!tc) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    return client.privmsg(message.channelName, `.me User "${args[1].toLowerCase()}" is not an editor...`)
                } else {
                    return {
                        text: `User "${args[1].toLowerCase()}" is not an editor...`,
                    };
                }
            } else {
                await bot.DB.channels.updateOne({ username: message.channelName },  {$pull:{ editors: { id: uid } }} ).exec();
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    return client.privmsg(message.channelName, `.me Removed "${args[1].toLowerCase()}" as an editor in this channel!`)
                } else {
                    return {
                        text: `Removed "${args[1].toLowerCase()}" as an editor in this channel!`,
                    }
                }
            }
        }
    },
};