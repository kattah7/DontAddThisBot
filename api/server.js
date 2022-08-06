const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const poros = require('./routes/poros');
const part = require('./routes/part');
const join = require('./routes/join');
const ban = require('./routes/ban');
const unban = require('./routes/unban');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(poros);
app.use(part);
app.use(join)
app.use(ban)
app.use(unban)

app.listen(3002, () => {
    console.log(`Server is running on port 3002`);
});
