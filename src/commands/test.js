module.exports = {
    name: 'test',
    cooldown: 5000,
    description: 'test',
    level: 3,
    execute: async (message, args, client) => {
        const userDB = await bot.DB.users.find({});
        for (const user of userDB) {
            if (!user.id) {
                console.log(user.username);
            }
        }
    },
};
