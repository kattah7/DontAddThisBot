const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const channels = require('./routes/channels');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(channels)

app.listen(3003, () => {
    console.log(`Public API is running on port 3003`);
});