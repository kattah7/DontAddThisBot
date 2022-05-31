module.exports = {
    name: "botjoin",
    aliases: [],
    cooldown: 3000,
    level: 3,
    description: "Join channel command",
    execute: async (message, args, client) => {
        // try to get the channel from the database
        const channelData = await bot.DB.channels.findOne({ username: args[0].toLowerCase() }).exec();

        // if the channel already exists, return
        if (channelData) {
            return {
                text: `Already in channel ${args[0].toLowerCase()}`,
            };
        }

        // attempt to join the channel
        try {
            await client.join(args[0].toLowerCase());
        } catch (err) {
            console.log(err);
            return {
                text: "Failed to join channel PoroSad",
            };
        }

        // create the channel
        const newChannel = new bot.DB.channels({
            username: args[0].toLowerCase(),
            joinedAt: new Date(),
        });

        // save the channel
        await newChannel.save();

        // return the response
        return {
            text: "Joined channel, make sure to vip/mod the bot please. (Bot isn't verified by twitch yet) :)",
        };
    },
};