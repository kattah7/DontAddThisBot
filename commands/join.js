module.exports = {
    name: "join",
    aliases: [],
    cooldown: 3000,
    description: "Join channel command",
    execute: async (message, args, client) => {
        // try to get the channel from the database
        const channelData = await bot.DB.channels.findOne({ username: message.senderUsername }).exec();

        // if the channel already exists, return
        if (channelData) {
            return {
                text: `Already in channel ${channelData.id}`,
            };
        }

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
        client.say(message.senderUsername, `Joined channel, ${message.senderUsername} kattahSpin`);
        return {
            text: `Joined channel, ${message.senderUsername} :)`,
        }
        
        
    },
};
