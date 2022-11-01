const { ParseUser } = require('../util/utils.js');

module.exports = {
    tags: 'moderation',
    name: 'welcome',
    aliases: [],
    cooldown: 3000,
    description: 'Give a new viewer a welcoming message <3',
    botPerms: 'vip',
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `Usage: !welcome <message>`,
            };
        }
        const targetUser = await ParseUser(args[0].toLowerCase());
        const { channelName } = message;
        client.say(message.channelName, `https://www.twitchdatabase.com/following/${targetUser}`);
        client.say(message.channelName, `https://twitchtracker.com/${targetUser}`);
        client.say(message.channelName, `https://logs.zzls.xyz/?channel=${channelName}&username=${targetUser}`);
        client.say(message.channelName, `https://logs.ivr.fi/?channel=${channelName}&username=${targetUser}`);
        client.say(message.channelName, `https://logs.zneix.eu/?channel=${channelName}&username=${targetUser}`);
        client.say(message.channelName, `https://justlog.kkx.one//?channel=${channelName}&username=${targetUser}`);
        client.say(message.channelName, `https://logs.mmattbot.com//?channel=${channelName}&username=${targetUser}`);
        client.say(message.channelName, `https://logs.magichack.xyz//?channel=${channelName}&username=${targetUser}`);
        client.say(message.channelName, `https://justlog.kkx.one//?channel=${channelName}&username=${targetUser}`);
        client.say(message.channelName, `https://vtlogs.moe//?channel=${channelName}&username=${targetUser}`);
        client.say(message.channelName, `https://logs.fuchsty.de//?channel=${channelName}&username=${targetUser}`);
        client.say(message.channelName, `https://logs.supa.codes//?channel=${channelName}&username=${targetUser}`);
        client.say(message.channelName, `https://modlookup.3v.fi/u/${targetUser}`);
        client.say(message.channelName, `https://www.twitchdatabase.com/roles/${targetUser}`);
    },
};
