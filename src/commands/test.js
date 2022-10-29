const { loginByID } = require('../util/utils');

module.exports = {
    name: 'test',
    cooldown: 5000,
    description: 'test',
    level: 3,
    execute: async (message, args, client) => {
        const userDB = await bot.DB.channels.find({});
        for (const user of userDB) {
            console.log(await loginByID(user.id));
        }
    },
};
