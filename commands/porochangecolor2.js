module.exports = {
    name: `changecolor`,
    cooldown: 5000,
    aliases: ["changecolour", "setcolor", "setcolour"],
    description: 'Change the bot color with 50 poro meat',
    poro: true,
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `pls insert hex color code`
            }
        }
        var reg=/^#[0-9A-F]{6}$/i;
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
            if (channelData.poroCount < 50) {
                return {
                    text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`
                }
            } else if (!reg.test(args[0])) {
                return {
                    text: `Invalid color, please use hex color code with # kattahDance`
                }
                
            } else {
                await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount - 50 } } ).exec();
                client.privmsg(message.channelName, `.color ${args[0]}`);
                return {
                    text: `Color changed! PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount - 50} meat total! 🥩`
                }
            }
    }
}