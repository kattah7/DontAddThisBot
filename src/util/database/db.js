const DB = require('mongoose');

DB.connect(`mongodb://127.0.0.1:27017/dontaddthisbot`, {});

DB.connection.on('connected', () => {
    Logger.info(`Connected to database!`);
});

DB.connection.on('disconnected', () => {
    Logger.error('Disconnected from database');
});

//Emote Schema
const ChannelsSchema = new DB.Schema({
    username: String,
    id: String,
    joinedAt: Date,
    prefix: String,
    commandsUsed: [{ command: String, Usage: Number, lastUsage: Date }],
    editors: [{ username: String, id: String, grantedAt: Date }],
    isChannel: Boolean,
    poroOnly: false,
    offlineOnly: false,
    stvOnly: false,
});

const PoroSchema = new DB.Schema({
    username: String,
    id: String,
    joinedAt: Date,
    poroCount: Number,
    poroPrestige: Number,
    poroRank: Number,
});

const UserSchema = new DB.Schema({
    id: String,
    username: String,
    firstSeen: Date,
    level: Number,
    commandsUsed: [{ command: String, Usage: Number, lastUsage: Date }],
    nameChanges: [{ username: String, changedAt: Date }],
});

const ModerationSchema = new DB.Schema({
    username: String,
    id: String,
    StvID: String,
    warnings: [{ reason: String, warnedAt: Date, warnedBy: String }],
});

const PrivateSchema = new DB.Schema({
    code: String,
    todaysCode: String,
});

exports.users = DB.model('users', UserSchema);
exports.poroCount = DB.model('poroCount', PoroSchema);
exports.channels = DB.model('channels', ChannelsSchema);
exports.private = DB.model('private', PrivateSchema);
exports.moderation = DB.model('moderation', ModerationSchema);
