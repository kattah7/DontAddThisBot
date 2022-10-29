module.exports = {
    name: 'test',
    cooldown: 3000,
    description: 'test',
    level: 3,
    async execute(message, args, client, userdata, params) {
        const poroData = await bot.DB.poroCount.find({}).exec();
        const topUsers = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige);

        const top5 = topUsers.slice(-1, 5);
        console.log(top5);
    },
};
