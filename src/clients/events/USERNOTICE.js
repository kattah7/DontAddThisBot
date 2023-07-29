const { client } = require('../../util/twitch/connections.js');

async function rewardPoros(userID, Amount) {
	return await bot.DB.poroCount.findOneAndUpdate({ id: userID }, { $inc: { poroCount: Number(Amount) } }).exec();
}

const USERNOTICE = () => {
	client.on('USERNOTICE', async (msg) => {
		if (['announcement', 'raid'].includes(msg.messageTypeID)) return;

		const { channelName, channelID, senderUsername, senderUserID } = msg;
		if ((msg.isResub || msg.isSub || msg.AnonSubgift || msg.isAnonGiftPaidUpgrade || msg.isSubgift) && channelID === '137199626') {
			try {
				const res = await rewardPoros(senderUserID, 1000);
				if (!res || res == null) {
					await client.say('kattah', "You aren't registered! type |poro to get started");
					return;
				}

				await client.say('kattah', `Thank you for subbing!, ${senderUsername}. Here is free 1,000 poros!. You have ${res.poroCount + 1000} poros now!`);
			} catch (err) {
				console.log(err);
			}
		}
	});
};

module.exports = { USERNOTICE };
