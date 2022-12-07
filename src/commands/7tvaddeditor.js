const utils = require('../util/twitch/utils.js');

module.exports = {
    tags: '7tv',
    name: '7tveditor',
    description: 'Usage: |editor add/remove <username>a',
    aliases: ['editor'],
    cooldown: 3000,
    permission: 2,
    async execute(message, args, client) {
        if (!args[0]) {
            return {
                text: 'Usage: |editor add/remove <username>',
            };
        }
        if (args[0] !== 'add' && args[0] !== 'remove') {
            return {
                text: 'Usage: |editor add/remove <username>',
            };
        }
        if (!args[1]) {
            return {
                text: 'Usage: |editor add/remove <username>',
            };
        }
        if (args[1] == message.channelName) {
            return {
                text: "You can't add yourself to the editor list!",
            };
        }

        const user = args[1].toLowerCase();
        const uid = await utils.IDByLogin(await utils.ParseUser(user));
        if (uid == null) {
            return {
                text: `Could not find user "${user}"`,
            };
        }

        if (args[0] == 'add') {
            const channel = await bot.DB.channels.findOne({ username: message.channelName }).exec();
            const findChannelEditors = channel.editors.find((editors) => editors.id === uid);
            if (findChannelEditors) {
                return {
                    text: `User "${user}" is already an editor...`,
                };
            } else {
                await bot.DB.channels
                    .updateOne(
                        { id: message.channelID },
                        {
                            $addToSet: {
                                editors: [
                                    {
                                        username: await utils.ParseUser(user),
                                        id: uid,
                                        grantedAt: new Date(),
                                    },
                                ],
                            },
                        }
                    )
                    .exec();
                return {
                    text: `Added "${user}" as an editor in this channel!`,
                };
            }
        }
        if (args[0] == 'remove') {
            const channel = await bot.DB.channels.findOne({ id: message.channelID }).exec();
            const tc = channel.editors.find((badge) => badge.id === uid);
            if (!tc) {
                return {
                    text: `User "${user}" is not an editor...`,
                };
            } else {
                await bot.DB.channels.updateOne({ id: message.channelID }, { $pull: { editors: { id: uid } } }).exec();
                return {
                    text: `Removed "${user}" as an editor in this channel!`,
                };
            }
        }
    },
};
