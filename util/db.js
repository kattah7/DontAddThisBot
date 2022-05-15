const DB = require("mongoose");

DB.connect(`mongodb://127.0.0.1:27017/dontaddthisbot`, {});

DB.connection.on("connected", () => {
    console.log(`Connected to database!`);
});

DB.connection.on("disconnected", () => {
    console.error("Disconnected from database");
});

//Emote Schema
const ChannelsSchema = new DB.Schema({
    username: String,
    id: String,
    joinedAt: Date,
});

exports.channels = DB.model("channels", ChannelsSchema);
