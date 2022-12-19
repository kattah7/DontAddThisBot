const DB = require('mongoose');
const { mongo } = require('../../config.json');
const { Logger, LogLevel } = require('../misc/logger');

DB.connect(mongo.host + mongo.database, {});

DB.connection.on('connected', () => {
	Logger.log(LogLevel.INFO, `Connected to database!`);
});

DB.connection.on('disconnected', () => {
	Logger.log(LogLevel.ERROR, 'Disconnected from database');
});

//Emote Schema
const ChannelsSchema = new DB.Schema({
	username: String,
	id: String,
	joinedAt: Date,
	prefix: String,
	editors: [{ username: String, id: String, grantedAt: Date }],
	isChannel: Boolean,
	offlineOnly: false,
	addedBy: [
		{
			username: String,
			id: String,
			addedAt: Date,
		},
	],
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

exports.updateUser = async (Collection, userID, newName) => {
	if (!userID || !newName) return { error: 'No user ID provided' };
	if (typeof userID !== 'string' || typeof newName !== 'string') return { error: 'User ID must be a string' };
	const user = await this[Collection].findOne({ id: userID }).exec();
	if (!user) return { error: 'User not found' };
	const updatedUser = await this[Collection].findOneAndUpdate({ id: userID }, { $set: { username: newName } }, { new: true }).exec();

	return {
		user: updatedUser,
		success: true,
	};
};
