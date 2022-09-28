const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const channelInfo = require('./routes/channelInfo');
const channels = require('./routes/channels');
const leaderboard = require('./routes/leaderboard');
const poroCount = require('./routes/poroCount');
const userInfo = require('./routes/users');
const moderationCommands = require('./routes/commands/moderation');
const stvCommands = require('./routes/commands/7tv');
const poroCommands = require('./routes/commands/poro');
const statsCommands = require('./routes/commands/stats');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(channelInfo);
app.use(channels);
app.use(leaderboard);
app.use(poroCount);
app.use(userInfo);
app.use(moderationCommands);
app.use(stvCommands);
app.use(poroCommands);
app.use(statsCommands);

app.listen(3003, () => {
    Logger.info(`Public API is running on port 3003`);
});
