const DB = require('mongoose');

DB.connect(`mongodb://127.0.0.1:27017/dontaddthisbot`, {});

DB.connection.on('connected', () => {
    console.log(`Connected to database!`);
});

DB.connection.on('disconnected', () => {
    console.error('Disconnected from database');
});

//Emote Schema
const ChannelsSchema = new DB.Schema({
    username: String,
    id: String,
    joinedAt: Date,
    prefix: String,
    editors: [{ username: String, id: String, grantedAt: Date }],
    poroOnly: false,
    offlineOnly: false,
});

const PoroSchema = new DB.Schema({
    username: String,
    id: String,
    joinedAt: Date,
    poroCount: Number,
    poroPrestige: Number,
});

const UserSchema = new DB.Schema({
    id: String,
    username: String,
    firstSeen: Date,
    level: Number,
    nameChanges: [{ username: String, changedAt: Date }],
});
exports.users = DB.model('users', UserSchema);

exports.poroCount = DB.model('poroCount', PoroSchema);
exports.poroPrestige = DB.model('poroPrestige', PoroSchema);
exports.joinedAt = DB.model('joinedAt', PoroSchema);

exports.channels = DB.model('channels', ChannelsSchema);
