const utils = require("../util/utils.js");

module.exports = {
    name: '7tveditor',
    description: 'Usage: |editor add/remove <username>',
    aliases: ["editor"],
    cooldown: 3000,
    permission: 2,
    stvOnly: true,
    async execute(message, args, client) {
        if (!args[0]) {
            return {
                text: "Usage: |editor add/remove <username>",
            };
        }
        if (args[0] !== "add" && args[0] !== "remove") {
            return {
                text: "Usage: |editor add/remove <username>",
            };
        }
        if (args[1] == message.channelName) {
            return {
                text: "You can't add yourself to the editor list!",
            };
        }
        const uid = await utils.IDByLogin(await utils.ParseUser(args[1].toLowerCase()));
        if (uid == null) {
            return {
                text: `Could not find user "${args[1].toLowerCase()}"`,
            };
        }
        if (args[0] == 'add') {
        const channel = await bot.DB.channels.findOne({ username: message.channelName }).exec();
        const tc = channel.editors.find(badge => badge.id === uid);
            if (tc) {
                return {
                    text: `User "${args[1].toLowerCase()}" is already an editor...`,
                };
            } else {
                await bot.DB.channels.updateOne({ username: message.channelName },  {$addToSet:{ editors:   [{ username: await utils.ParseUser(args[1].toLowerCase()), id: uid, grantedAt: new Date()  }] }} ).exec();
                return {
                    text: `Added "${args[1].toLowerCase()}" as an editor in this channel!`,
                }
            }
        }
        if (args[0] == 'remove') {
            const channel = await bot.DB.channels.findOne({ username: message.channelName }).exec();
            const tc = channel.editors.find(badge => badge.id === uid);
            if (!tc) {
                return {
                    text: `User "${args[1].toLowerCase()}" is not an editor...`,
                };
            } else {
                await bot.DB.channels.updateOne({ username: message.channelName },  {$pull:{ editors: { id: uid } }} ).exec();
                return {
                    text: `Removed "${args[1].toLowerCase()}" as an editor in this channel!`,
                }
            }
        }
    },
};