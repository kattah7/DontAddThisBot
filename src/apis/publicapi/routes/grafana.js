const express = require('express');
const router = express.Router();
const client = require('prom-client');
const register = new client.Registry();

const channelsLengthGauge = new client.Gauge({
    name: 'channels',
    help: 'Number of channels',
    registers: [register],
});
register.registerMetric(channelsLengthGauge);

register.setDefaultLabels({
    app: 'DontAddThisBot',
});

client.collectDefaultMetrics({ register });

setInterval(async () => {
    const channels = await bot.DB.channels.count({ isChannel: true }).exec();
    channelsLengthGauge.set(channels);
}, 100);

router.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
});

module.exports = router;
