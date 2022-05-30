const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const poros = require("./routes/poros");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(poros);

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 1337");
});
