const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const parser = require('cookie-parser');
const { backend, token } = require('../../config.json');

const channelInfo = require('./routes/GET/channelInfo');
const channels = require('./routes/GET/channels');
const leaderboard = require('./routes/GET/leaderboard');
const poroCount = require('./routes/GET/poroCount');
const userInfo = require('./routes/GET/users');
const commands = require('./routes/GET/commands');
const grafana = require('./routes/GET/grafana');
const authCallback = require('./routes/GET/authCallback');
const redirectUser = require('./routes/POST/redirect');
const userAuthInfo = require('./routes/GET/userAuthInfo');
const userLogout = require('./routes/POST/userLogout');
const join = require('./routes/POST/join');
const part = require('./routes/POST/part');
const create = require('./routes/POST/createUser');

const app = express();

app.use(
    cors({
        origin: backend.origin,
        credentials: true,
    }),
    express.json(),
    parser()
);
for (const API of [
    channelInfo,
    channels,
    leaderboard,
    poroCount,
    userInfo,
    commands,
    grafana,
    authCallback,
    redirectUser,
    userAuthInfo,
    userLogout,
    join,
    part,
    create,
]) {
    app.use(API);
}

app.listen(backend.port, () => {
    Logger.info(`API is running on port 3003`);
});