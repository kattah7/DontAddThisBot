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
app.use(part);
app.use(join)
app.use(ban)
app.use(unban)
app.use(admin)
app.use(offline)
app.use(poroOnly)
app.use(stvOnly)

app.listen(3002, () => {
    console.log(`Server is running on port 3002`);
});
