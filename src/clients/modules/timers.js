const Redis = require('ioredis');
const redis = new Redis({});
const fetch = require('node-fetch');
const { client } = require('../../util/twitch/connections');
const { loginByID } = require('../../util/twitch/utils');
const humanizeDuration = require('../../misc/humanizeDuration');

const getTimers = () => {
	setInterval(async () => {
		const deleteRedisReminder = async (key) => {
			await bot.Redis.del(key);
		};

		const getRedisKeysAndValues = async () => {
			const getAllRedisKeys = await redis.keys('*');
			const filterRedisKeys = await getAllRedisKeys.filter((key) => key.includes('buff:'));
			filterRedisKeys.forEach(async (key) => {
				const value = await redis.get(key);
				const parseValue = await JSON.parse(value);
				const removeAllSlashes = await parseValue.replace(/\\/g, '');
				const { id, desired_price, executed_channel: channel, Date: reminder_date, current_price } = await JSON.parse(removeAllSlashes)[0];
				try {
					const { data } = await fetch(
						`https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${id}&page_num=1&sort_by=default&mode=&allow_tradable_cooldown=1&_=1667085434023`,
						{
							headers: {
								accept: 'application/json, text/plain, */*',
								'accept-language': 'en-US,en;q=0.9',
								'sec-fetch-dest': 'empty',
								'sec-fetch-mode': 'cors',
								'sec-fetch-site': 'same-site',
								'x-requested-with': 'XMLHttpRequest',
							},
						},
					).then((res) => res.json());
					const { goods_infos, items } = data;
					const channelName = await loginByID(channel);
					const requestedUser = await loginByID(key.split(':')[1]);
					const readableDate = humanizeDuration(Date.now() - reminder_date);

					if (desired_price >= items[0].price) {
						await deleteRedisReminder(key);
						return await client.say(
							channelName,
							`@${requestedUser} The price of "${goods_infos[id].market_hash_name}" is now ${items[0].price} RMB! Your desired price was ${desired_price} (${readableDate} ago)`,
						);
					}

					if (current_price !== items[0].price && !desired_price) {
						await deleteRedisReminder(key);
						return await client.say(
							channelName,
							`@${requestedUser} The price of "${goods_infos[id].market_hash_name}" has changed from ${current_price} to ${items[0].price} RMB! (${readableDate} ago)`,
						);
					}
				} catch (error) {
					console.log(error);
					await deleteRedisReminder(key);
				}
			});
		};
		getRedisKeysAndValues();
	}, 25000);
};

module.exports = { getTimers };
