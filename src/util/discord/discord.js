const { discord } = require('../../../config.json');
const fetch = require('node-fetch');

async function sendWebhookMsg(WebHook, WebhookMsg) {
	await fetch(WebHook + '?wait=true', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(WebhookMsg),
	});
}

function returnEmbed(Author, color, Title, Desc, Thumbnail, Image, Fields = []) {
	return {
		embeds: [
			{
				author: {
					name: Author.name,
					con_url: Author.url,
				},
				color: color,
				title: Title,
				description: Desc,
				timestamp: new Date(),
				thumbnail: {
					url: Thumbnail,
				},
				image: {
					url: Image,
				},
				footer: {
					text: 'Pulled time',
					icon_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png',
				},
				fields: Fields,
			},
		],
	};
}

exports.NewPoro = async (AccAge, UID, username, channel, description, logo) => {
	const WebHook = `https://discord.com/api/webhooks/${discord.poro_logs}`;
	const WebhookMsg = {
		...returnEmbed(
			{
				name: '',
				url: '',
			},
			1127128,
			`${username} in #${channel} said`,
			`${description}`,
			logo,
			'',
			[
				{
					name: 'Account Age',
					value: AccAge,
				},
				{
					name: 'Unique Identifier',
					value: UID,
				},
			],
		),
	};
	await sendWebhookMsg(WebHook, WebhookMsg);
};

exports.racist = async (username, userID, channel, message) => {
	const WebHook = `https://discord.com/api/webhooks/${discord.racist}`;
	const WebhookMsg = {
		...returnEmbed(
			{
				name: 'Racist',
				url: 'https://i.nuuls.com/g8l2r.png',
			},
			0x0099ff,
			`Sent by ${username}(UID:${userID}) in #${channel}`,
			`${message}`,
		),
	};
	await sendWebhookMsg(WebHook, WebhookMsg);
};

exports.newChannel = async (username, message, addedBy) => {
	const WebHook = `https://discord.com/api/webhooks/${discord.new_channels}`;
	const Title = `Joined channel ${username} ${addedBy ? `by ${addedBy}` : ''}`;
	const Description = `${message}`;
	const WebhookMsg = {
		...returnEmbed(
			{
				name: 'New Channel',
				url: 'https://i.nuuls.com/g8l2r.png',
			},
			0x0099ff,
			Title,
			Description,
		),
	};
	await sendWebhookMsg(WebHook, WebhookMsg);
};

exports.errorMessage = async (channel, username, message, error) => {
	const WebHook = `https://discord.com/api/webhooks/${discord.errors}`;
	const WebhookMsg = {
		content: `<@363968088783323136>`,
		...returnEmbed(
			{
				name: 'Error',
				url: 'https://i.nuuls.com/g8l2r.png',
			},
			0x0099ff,
			`Error in ${channel} by ${username}`,
			`${message}, ${error}`,
		),
	};
	await sendWebhookMsg(WebHook, WebhookMsg);
};

exports.BAND = async (channel, action, message, color, pfp) => {
	const WebHook = `https://discord.com/api/webhooks/${discord.action}`;
	const WebhookMsg = {
		...returnEmbed(
			{
				name: `Action`,
				url: '',
			},
			color,
			`${action} in #${channel}`,
			`${message}`,
			pfp,
		),
	};
	await sendWebhookMsg(WebHook, WebhookMsg);
};

exports.PoroGive = async (sender, channelName, args, sendAmount) => {
	const WebHook = `https://discord.com/api/webhooks/${discord.poro_give}`;
	const Title = `${sender} has given ${args} ${sendAmount} poro in #${channelName}`;
	const WebhookMsg = {
		...returnEmbed(
			{
				name: 'Poro Give',
				url: 'https://i.nuuls.com/g8l2r.png',
			},
			0x0099ff,
			Title,
		),
	};
	await sendWebhookMsg(WebHook, WebhookMsg);
};

exports.Levels = async (message) => {
	const WebHook = `https://discord.com/api/webhooks/${discord.action}`;
	const WebhookMsg = {
		...returnEmbed(
			{
				name: 'Levels',
				url: 'https://i.nuuls.com/g8l2r.png',
			},
			0x0099ff,
			message,
		),
	};
	await sendWebhookMsg(WebHook, WebhookMsg);
};
