const utils = require('../util/utils.js');
const discord = require('../util/discord.js');

module.exports = {
    name: 'botjoin',
    aliases: [],
    cooldown: 3000,
    description: 'Join channel command',
    execute: async (message, args, client) => {
        const isSenderVerifiedBot = await utils.IVR(message.senderUserID);
        if (isSenderVerifiedBot.verifiedBot) {
            return {
                text: `Verified bot cannot join channels. kattahHappy`
            }
        };
        const targetUser = await utils.ParseUser(args[0]?.toLowerCase());
        if (!targetUser || !/^[A-Z_\d]{3,26}$/i.test(targetUser)) {
            return {
                text: `Invalid user kattahHappy`
            }
        }
        const doesUserExist = await utils.IVR(await utils.IDByLogin(targetUser));
        if (!await utils.IDByLogin(targetUser)) {
            return {
                text: `User not found kattahHappy`
            }
        }
        if (doesUserExist.banned) {
            return {
                text: `User ${targetUser} not found. kattahHappy`
            }
        };
        const getChannelMods = await client.getMods(targetUser);
        const findSenderUserNameInMods = getChannelMods.find((user) => user == message.senderUsername);
        if (!findSenderUserNameInMods) {
            return {
                text: `You can't do that, you must be a moderator. kattahHappy`
            }
        };
        const targetUserID = await utils.IDByLogin(targetUser);
        const channelData = await bot.DB.channels.findOne({ id: targetUserID }).exec();
        const userData = await bot.DB.users.findOne({ id: targetUserID }).exec();
        // if the channel already exists, return
        if (channelData) {
            return {
                text: `Already in channel ${args[0].toLowerCase()}`,
            };
        }

        // attempt to join the channel
        try {
            await client.join(targetUser);
        } catch (err) {
            console.log(err);
            return {
                text: 'Failed to join channel PoroSad',
            };
        }

        // create the channel
        const newChannel = new bot.DB.channels({
            username: targetUser,
            id: targetUserID,
            joinedAt: new Date(),
            addedBy: {
                username: message.senderUsername,
                id: message.senderUserID,
                joinedAt: new Date(),
            }
        });

        await newChannel.save();

        if (!userData) {
            const userdata =
            new bot.DB.users({
                id: targetUserID,
                username: targetUser,
                firstSeen: new Date(),
                prefix: '|',
                level: 1,
            });
            await userdata.save();
        }

        // return the response
        await discord.newChannel(message.senderUsername, message.senderUserID, message.channelName, message.messageText);
        await client.say(targetUser, `Joined channel, Added by ${message.senderUsername} kattahSpin Also check @DontAddThisBot panels for info!`)
        return {
            text: `Joined channel, ${args[0].toLowerCase()} :)`,
        };
    },
};
