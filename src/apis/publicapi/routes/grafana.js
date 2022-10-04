const express = require('express');
const router = express.Router();
const client = require('prom-client');
const register = new client.Registry();

const channelsLengthGauge = new client.Gauge({
    name: 'channels',
    help: 'Number of channels',
});
const totalPoros = new client.Gauge({
    name: 'total_poros',
    help: 'Total number of poros',
});
for (const metrics of [channelsLengthGauge, totalPoros]) {
    register.registerMetric(metrics);
}

register.setDefaultLabels({
    app: 'DontAddThisBot',
});

client.collectDefaultMetrics({ register });

setInterval(async () => {
    const channels = await bot.DB.channels.count({ isChannel: true }).exec();
    const poroData = await bot.DB.poroCount.find({}).exec();
    let sum = 0;
    for (const xd of poroData) {
        sum += xd.poroCount;
    }
    channelsLengthGauge.set(channels);
    totalPoros.set(sum);
}, 100);

router.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
});

module.exports = router;
