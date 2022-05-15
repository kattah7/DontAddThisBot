module.exports = {
    name: "join",
    aliases: [],
    cooldown: 3000,
    description: "lol",
    execute: async (message, args, client) => {
        // return if its not in the bots channel
        if (message.channelName !== "dontaddthisbot") return;

        //for testing
        if (message.senderUsername !== "fookstee") return;

        // try to get the channel from the database
        const channelData = await bot.DB.channels.findOne({ username: message.senderUsername }).exec();

        // if the channel already exists, return
        if (channelData) return;

        // attempt to join the channel
        try {
            await client.join(message.senderUsername);
        } catch (err) {
            console.log(err);
            return {
                text: "Failed to join channel PoroSad",
            };
        }

        // create the channel
        const newChannel = new bot.DB.channels({
            username: message.senderUsername,
            id: message.senderUserID,
            joinedAt: new Date(),
        });

        // save the channel
        await newChannel.save();

        // return the response
        return {
            text: "ok",
        };
    },
};
