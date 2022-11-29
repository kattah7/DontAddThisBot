module.exports = {
    tags: 'stats',
    name: 'test',
    aliases: ['test'],
    cooldown: 3000,
    description: 'test',
    level: 3,
    execute: async (message, args, client) => {
        const userDB = await bot.DB.channels.find({}).exec();
        // in a loop remove all commandsUsed from db
        for (const user of userDB) {
            // console log all commandsUsed array
            console.log(user.commandsUsed);
            // completely remove commandsUsed array
            await bot.DB.channels.findOneAndUpdate({ id: user.id }, { $set: { commandsUsed: [] } }).exec();
            Logger.info(`Removed commandsUsed from ${user.username}`);
            // remove entire array
            await bot.DB.channels.findOneAndUpdate({ id: user.id }, { $unset: { commandsUsed: [] } }).exec();
        }
    },
};
