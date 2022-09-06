module.exports = {
    name: "hint",
    level: 3,
    cooldown: 5000,
    execute: async (message, args, client) => {
        const doesHintExist = await bot.DB.private.findOne({ code: "code" }).exec();
        if (!doesHintExist) {
            try {
                const newCode = new bot.DB.private({
                    code: "code",
                    todaysCode: args.join(" "),
                })
                await newCode.save();
                return client.say(message.channel, `New code set!`);
            } catch (err) {
                console.log(err);
            }
        } else {
            await bot.DB.private.updateOne({ code: "code" }, { $set: { todaysCode: args.join(" ") } }).exec();
            return {
                text: `code set!`,
            }
        }
        
    }
}