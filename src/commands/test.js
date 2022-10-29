module.exports = {
    name: 'test',
    cooldown: 3000,
    description: 'test',
    level: 3,
    async execute(message, args, client, userdata, params) {
        const poroData = await bot.DB.poroCount.find().exec();
        const topUsers = poroData.filter((user) => user.poroPrestige == 8);
        console.log(topUsers);
    },
};
