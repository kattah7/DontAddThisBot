const { ParseUser, IVRByLogin } = require('../util/twitch/utils');
const { ChangeColor } = require('../token/helix');
const { color } = require('../util/twitch/botcolor.json');

module.exports = {
    tags: 'stats',
    name: 'color',
    cooldown: 3000,
    aliases: [],
    description: "Gets user's chat color",
    execute: async (message, args, client) => {
        async function changeChatColor(chatColor, botColor) {
            await ChangeColor(chatColor);
            await new Promise((resolve) => setTimeout(resolve, 30));
            await client.privmsg(message.channelName, `.me @${message.senderUsername}, ████ ${chatColor}`);
            await new Promise((resolve) => setTimeout(resolve, 30));
            await ChangeColor(botColor);
        }

        const targetUser = await ParseUser(args[0] ?? message.senderUsername);
        if (args[0]) {
            const user = await IVRByLogin(targetUser);
            if (user === null || user.chatColor === null) {
                return {
                    text: `${targetUser} does not have a chat color set. WutFace`,
                };
            }

            try {
                changeChatColor(user.chatColor, color);
                return;
            } catch (err) {
                return {
                    text: `Failed to get ${targetUser}'s chat color.`,
                };
            }
        }

        if (!message.colorRaw || message.colorRaw === null) {
            return {
                text: `You do not have a chat color set. WutFace`,
            };
        }

        return await changeChatColor(message?.colorRaw, color);
    },
};
