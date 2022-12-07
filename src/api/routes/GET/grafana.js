const express = require('express');
const router = express.Router();
const prom = require('prom-client');
const register = new prom.Registry();
const { client } = require('../../../util/twitch/connections.js');

const channelsLengthGauge = new prom.Gauge({
    name: 'channels',
    help: 'Number of channels',
});
const totalPoros = new prom.Gauge({
    name: 'total_poros',
    help: 'Total number of poros',
});
const messageMetric = new prom.Counter({
    name: 'messages',
    help: 'Number of messages',
});

for (const metrics of [channelsLengthGauge, totalPoros, messageMetric]) {
    register.registerMetric(metrics);
}

register.setDefaultLabels({
    app: 'DontAddThisBot',
});

prom.collectDefaultMetrics({ register });

setInterval(async () => {
    const channels = await bot.DB.channels.count({ isChannel: true }).exec();
    const poroData = await bot.DB.poroCount.find({}).exec();
    let sum = 0;
    for (const xd of poroData) {
        sum += xd.poroCount;
    }
    channelsLengthGauge.set(channels);
    totalPoros.set(sum);
}, 1000 * 60 * 1);

client.on('message', () => {
    messageMetric.inc(1);
});

router.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
});

module.exports = router;
