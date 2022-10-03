const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const part = require('./routes/part');
const join = require('./routes/join');
const ban = require('./routes/ban');
const unban = require('./routes/unban');
const admin = require('./routes/checkadmin');
const offline = require('./routes/offlineOnly');
const poroOnly = require('./routes/poroOnly');
const stvOnly = require('./routes/stvOnly');

const app = express();

app.use(morgan('dev'));
app.use(cors());
for (const api of [part, join, ban, unban, admin, offline, poroOnly, stvOnly]) {
    app.use(api);
}

app.listen(3002, () => {
    Logger.info(`Internal API Running on 3002`);
});
