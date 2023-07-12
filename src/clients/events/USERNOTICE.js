const { client } = require('../../util/twitch/connections.js');

async function rewardPoros(userID, Amount) {
	return await bot.DB.poroCount.findOneAndUpdate({ id: userID }, { $inc: { poroCount: Number(Amount) } }).exec();
}

const USERNOTICE = () => {
	client.on('USERNOTICE', async (msg) => {
		const { channelName, channelID, senderUsername, senderUserID } = msg;
		if (!msg.isSub() && !msg.isResub()) {
			return;
		}

		if (channelID !== '137199626') return;
		try {
			const res = await rewardPoros(senderUserID, 3500);
			if (!res || res == null) {
				await client.say('kattah', "You aren't registered! type |poro to get started");
				return;
			}

			await client.say('kattah', `Thank you for subbing!, ${senderUsername}. Here is free 3,500 poros!. You have ${res.poroCount + 3500} poros now!`);
		} catch (err) {
			console.log(err);
		}
	});
};

module.exports = { USERNOTICE };
