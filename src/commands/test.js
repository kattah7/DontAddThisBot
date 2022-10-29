module.exports = {
    name: 'test',
    cooldown: 3000,
    description: 'test',
    level: 3,
    async execute(message, args, client, userdata, params) {
        const poroData = await bot.DB.poroCount.find().exec();
        const topUsers = poroData.filter((a) => a.poroPrestige > 0).sort((a, b) => b.poroPrestige - a.poroPrestige);
        console.log(topUsers);
    },
};
