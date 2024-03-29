const { Logger, LogLevel } = require('../../misc/logger');

module.exports = {
	'channel.follow': async (msg, type, channel, id, status, session_id) => {
		console.log(msg);
		const { user_id, user_login, broadcaster_user_id: streamerID, broadcaster_user_login: streamerName, followed_at } = msg;
		Logger.log(LogLevel.SILLY, `[${user_id}] ${user_login} followed ${streamerName} at ${followed_at}`);
	},
};
