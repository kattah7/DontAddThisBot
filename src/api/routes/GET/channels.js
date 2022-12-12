const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const redis = new Redis({});

async function returnChannelCount() {
	const channels = await bot.DB.channels.count({ isChannel: true }).exec();
	return channels;
}

async function returnUsersCount() {
	const users = await bot.DB.users.count({}).exec();
	return users;
}

async function returnPoroCount() {
	const poroData = await bot.DB.poroCount.find({}).exec();
	let sum = 0;
	for (const xd of poroData) {
		sum += xd.poroCount;
	}

	return sum;
}

async function totalCommands() {
	const commands = await bot.SQL.query(`SELECT * FROM commands;`);
	let count = 0;
	for (const { command_usage: usage } of commands.rows) {
		count += usage;
	}

	return count;
}

async function makeRequest() {
	console.log('Updated channels endpoint');
	await redis.set(
		'channelsEndpoint',
		JSON.stringify({
			channelCount: await returnChannelCount(),
			totalPoros: await returnPoroCount(),
			seenUsers: await returnUsersCount(),
			executedCommands: await totalCommands(),
		}),
	);
}

makeRequest().then(() => {
	setInterval(() => {
		makeRequest();
	}, 1000 * 60 * 1);
});

router.get('/api/bot/channels', async (req, res) => {
	const todaysCode = await bot.DB.private.findOne({ code: 'code' }).exec();
	const redisValue = await redis.get('channelsEndpoint');
	const { channelCount, totalPoros, seenUsers, executedCommands } = JSON.parse(redisValue);

	return res.status(200).json({
		channelCount: channelCount,
		totalPoros: totalPoros,
		todaysCode: todaysCode.todaysCode,
		seenUsers: seenUsers,
		executedCommands: executedCommands,
	});
});

module.exports = router;
