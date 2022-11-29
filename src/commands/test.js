module.exports = {
    tags: 'stats',
    name: 'test',
    aliases: ['test'],
    cooldown: 3000,
    description: 'test',
    execute: async (message, args, client) => {
        const userDB = await bot.DB.users.find({}).exec();
        // in a loop remove all commandsUsed from db
        for (const user of userDB) {
            if (!user.commandsUsed || user.commandsUsed.length === 0) {
                console.log(`no commandsUsed for ${user.username}`);
                continue;
            }
            await bot.DB.users.findOneAndUpdate({ id: user.id }, { $set: { commandsUsed: [] } }).exec();
            await bot.DB.users.findOneAndUpdate({ id: user.id }, { $unset: { commandsUsed: [] } }).exec();
            console.log(`Removed commandsUsed from ${user.username}`);
        }
    },
};
