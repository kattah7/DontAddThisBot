const { loginByID } = require('../util/utils');

module.exports = {
    name: 'test',
    cooldown: 5000,
    description: 'test',
    level: 3,
    execute: async (message, args, client) => {
        const userDB = await bot.DB.channels.find({});
        for (const user of userDB) {
            const username = await loginByID(user.id);
            if (user.username != username) {
                await bot.DB.channels.findOneAndUpdate({ id: user.id }, { $set: { username: username } }).exec();
                console.log(`Updated ${user.username} to ${username}`);
            }
        }
    },
};
