const express = require('express');
const parser = require('cookie-parser');
const { backend } = require('../../config.json');
const cors = require('cors');
const morgan = require('morgan');
const { Logger, LogLevel } = require('../misc/logger');

const channelInfo = require('./routes/GET/channelInfo');
const channels = require('./routes/GET/channels');
const leaderboard = require('./routes/GET/leaderboard');
const poroCount = require('./routes/GET/poroCount');
const userInfo = require('./routes/GET/users');
const commands = require('./routes/GET/commands');
const grafana = require('./routes/GET/grafana');
const userAuthInfo = require('./routes/GET/userAuthInfo');
const botInfo = require('./routes/GET/bot');
const stable = require('./routes/GET/stable');

const join = require('./routes/POST/join');
const part = require('./routes/POST/part');
const create = require('./routes/POST/createUser');
const auth = require('./routes/POST/authenticate');
const modJoin = require('./routes/POST/modjoin');
const commandStatus = require('./routes/POST/commandStatus');

const offline = require('./routes/PUT/offline');
const prefix = require('./routes/PUT/prefix');
const language = require('./routes/PUT/language');

const app = express();
app.use(cors(), morgan('dev'));
app.use(express.json(), parser(), [
	channelInfo,
	channels,
	leaderboard,
	poroCount,
	userInfo,
	commands,
	grafana,
	userAuthInfo,
	botInfo,
	join,
	part,
	create,
	auth,
	modJoin,
	commandStatus,
	stable,
	offline,
	prefix,
	language,
]);

app.listen(backend.port, () => {
	Logger.log(LogLevel.INFO, `API is running on port ${backend.port}`);
});
