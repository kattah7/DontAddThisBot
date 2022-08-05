const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const poros = require('./routes/poros');
const channels = require('./routes/channel');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(poros);
app.use(channels);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
