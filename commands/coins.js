const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "poro",
    cooldown: 3000,
    description: "Get poro every 1 hour",
    execute: async(message, args) => {
        const lastUsage = await bot.Redis.get(`poro:${message.senderUsername}`);
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        const random = Math.floor(Math.random() * 40);

        if (!channelData) {
            const newChannel = new bot.DB.poroCount({
                username: message.senderUsername,
                id: message.senderUserID,
                joinedAt: new Date(),
                poroCount: 10,
            });
            
            await newChannel.save();
            await bot.Redis.set(`poro:${message.senderUsername}`, Date.now(), 0);

            return {
                text: "New user! PoroSad here is free 10 poro meat"
            }
        }

        if (lastUsage || channelData) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 1) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 *1;
                return {
                    text: `Come back in 1 hour PoroSad Please wait ${humanizeDuration(ms)}. PoroSad ${channelData.poroCount} meat total!`,
                };
            }
        }

        await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount + random } } ).exec();

        await bot.Redis.set(`poro:${message.senderUsername}`, Date.now(), 0);
        return {
            text: `Poro slaugthered! PoroSad (+${random}) PoroSad ${channelData.poroCount + random} meat total!`,
        };
    }
}