const { client } = require('../../util/twitch/connections.js');
const { PoroNumberOne } = require('../../util/twitch/utils.js');
const { getTimers } = require('../modules/timers.js');
const { Logger, LogLevel } = require('../../misc/logger');
const { handler: handlerTwo } = require('../modules/handler');
const { racism, slurs } = require('../../misc/regex');
const { shortenText } = require('../../misc/utility');
const { ChangeColor } = require('../../token/helix');
const discord = require('../../util/discord/discord.js');

const PRIVMSG = async function () {
	getTimers();
	client.on('PRIVMSG', async (msg) => {
		const ts = Date.now();
		const received = performance.now();
		const msgData = {
			user: {
				id: msg.senderUserID,
				name: msg.displayName,
				login: msg.senderUsername,
				display: msg.displayName,
				colorRaw: msg.colorRaw,
				badgesRaw: msg.badgesRaw,
				color: msg.color,
				perms: { mod: msg.isMod, broadcaster: msg.badges.hasBroadcaster, vip: msg.badges.hasVIP },
			},
			channel: {
				id: msg.channelID,
				login: msg.channelName,
			},
			id: msg.messageID,
			isAction: msg.isAction,
			raw: msg.rawSource,
			text: msg.messageText,
			timestamp: msg.serverTimestampRaw,
			emotes: msg.emotes,
			tags: msg.ircTags,
			received,

			send: async function (message, reply) {
				try {
					message = shortenText(message, 490);
					if (this.channel.id === '71092938') {
						return await client.say('dontaddthisbot', reply ? `@${this.user.display}, ${message}` : message);
					}

					if (racism.test(this.args || message) || slurs.test(this.args || message)) {
						await discord.racist(this.user.login, this.user.id, this.channel.login, this.args);
						await client.say(this.channel.login, `This message violates Twitch's Terms of Service`);
						return;
					}

					if (await PoroNumberOne(this.user.id)) {
						const color = await bot.Redis.get('botColor');

						await ChangeColor(this.user.colorRaw);
						await client.me(this.channel.login, reply ? `@${this.user.display}, ${message}` : message);
						await ChangeColor(color);
						return;
					}

					const Reply = `@sent-ts=${ts};reply-parent-msg-id=${this.id} PRIVMSG #${this.channel.login} :/ ${message}`;
					const NoReply = `@sent-ts=${ts} PRIVMSG #${this.channel.login} :/ ${message}`;
					client.sendRaw(reply ? Reply : NoReply);
				} catch (err) {
					Logger.log(LogLevel.ERROR, `Error while sending message: ${err.message}`);
				}
			},
		};
		handlerTwo(msgData);
	});
};

module.exports = { PRIVMSG };
