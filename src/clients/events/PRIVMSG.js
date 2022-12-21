const { client } = require('../../util/twitch/connections.js');
const { PoroNumberOne } = require('../../util/twitch/utils.js');
const { getTimers } = require('../modules/timers.js');
const { Logger, LogLevel } = require('../../misc/logger');
const { handler: handlerTwo } = require('../modules/handler');
const { racism, slurs } = require('../../misc/regex');
const { shortenText } = require('../../misc/utility');
const { ChangeColor } = require('../../token/helix');
const { color } = require('../../util/twitch/botcolor.json');
const discord = require('../../util/discord/discord.js');

const PRIVMSG = async function () {
	getTimers();
	client.on('PRIVMSG', async (msg) => {
		const { channelName, senderUserID, senderUsername, messageText } = msg;
		if (channelName == 'turtoise') {
			if (messageText.startsWith('$cookie') && senderUserID == '188427533') {
				client.say(channelName, '$cookie gift Wisdomism');
				return;
			}
		} else if (channelName === 'dontaddthisbot' && senderUsername !== 'dontaddthisbot') {
			if (messageText.startsWith('!restart')) {
				client.say(channelName, '!restart');
				return;
			} else if (messageText.startsWith('!continue')) {
				client.say(channelName, '!continue');
				return;
			}
		}

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

					if (racism.test(this.args || message) || slurs.test(this.args || message)) {
						await discord.racist(this.user.login, this.user.id, this.channel.login, this.args);
						await client.say(this.channel.login, `This message violates Twitch's Terms of Service`);
						return;
					}

					if (await PoroNumberOne(this.user.id)) {
						await ChangeColor(this.user.colorRaw);
						await client.me(this.channel.login, reply ? `@${this.user.display}, ${message}` : message);
						await ChangeColor(color);
						return;
					}

					const Reply = `@sent-ts=${ts};reply-parent-msg-id=${this.id} PRIVMSG #${this.channel.login} :/ ${message}`;
					const NoReply = `@sent-ts=${ts} PRIVMSG #${this.channel.login} :/ ${message}`;
					client.sendRaw(reply ? Reply : NoReply);
				} catch (err) {
					console.log(err);
					await discord.errorMessage(this.msg.channel.login, this.msg.user.login, this.msg.args, err.message);
					Logger.log(LogLevel.ERROR, `Error while sending message: ${err.message}`);
				}
			},
		};
		handlerTwo(msgData).then(() => console.log(`Response timea: ${performance.now() - received}ms`));
	});
};

module.exports = { PRIVMSG };
