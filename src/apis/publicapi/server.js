const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const channelInfo = require('./routes/channelInfo');
const channels = require('./routes/channels');
const leaderboard = require('./routes/leaderboard');
const poroCount = require('./routes/poroCount');
const userInfo = require('./routes/users');
const commands = require('./routes/commands');
const grafana = require('./routes/grafana');

const app = express();

app.use(morgan('dev'));
app.use(cors());
for (const API of [channelInfo, channels, leaderboard, poroCount, userInfo, commands, grafana]) {
    app.use(API);
}

app.listen(3003, () => {
    Logger.info(`Public API is running on port 3003`);
});
