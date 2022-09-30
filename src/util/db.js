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
});

const UserSchema = new DB.Schema({
    id: String,
    username: String,
    firstSeen: Date,
    level: Number,
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

const CodeSchema = new DB.Schema({
    hint: String,
    code: String
})

exports.users = DB.model('users', UserSchema);
exports.poroCount = DB.model('poroCount', PoroSchema);
exports.channels = DB.model('channels', ChannelsSchema);
exports.private = DB.model('private', PrivateSchema);
exports.moderation = DB.model('moderation', ModerationSchema);
exports.codes = DB.model('code', CodeSchema);
