const fetch = require('node-fetch');

module.exports = {
    tags: 'stats',
    name: 'buff',
    cooldown: 5000,
    description: 'Price alert for buff163, usage: |buff <item ID> <price, if you want>',
    execute: async (message, args, client) => {
        const createRedisReminder = async (item) => {
            const key = `buff:${message.senderUserID}`;
            const value = JSON.stringify(item);
            await bot.Redis.set(key, value, 0);
        };

        const getRedisReminder = async () => {
            const key = `buff:${message.senderUserID}`;
            const value = await bot.Redis.get(key);
            return value;
        };

        const deleteRedisReminder = async () => {
            const key = `buff:${message.senderUserID}`;
            await bot.Redis.del(key);
        };

        if (!args[0]) {
            return {
                text: `Please provide a skin ID`,
            };
        }

        async function getItem(itemID) {
            const { data } = await fetch(
                `https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${itemID}&page_num=1&sort_by=default&mode=&allow_tradable_cooldown=1&_=1667085434023`,
                {
                    headers: {
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'en-US,en;q=0.9',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-site',
                        'x-requested-with': 'XMLHttpRequest',
                    },
                }
            ).then((res) => res.json());
            return data;
        }
        if (!(await getItem(args[0]))) {
            return {
                text: `Invalid item ID`,
            };
        }

        if (isNaN(args[1]) && args[1]) {
            return {
                text: `Please provide a valid price`,
            };
        }

        const { items, goods_infos } = await getItem(args[0]);

        if (!items.length) {
            return {
                text: `No items foundm, to get skin ids; more info at buff.163.com`,
            };
        }

        if (args[1] > items[0].price) {
            return {
                text: `You can only currently remind yourself with the price is lower than ${items[0].price} RMB`,
            };
        }

        const item = goods_infos[`${items[0].goods_id}`].market_hash_name;
        const getRedis = await getRedisReminder();
        if (getRedis) {
            await deleteRedisReminder();
            return {
                text: `Deleting reminder for "${item}".`,
            };
        } else {
            const isArgs = args[1] ? `at desired price ${args[1]} RMB` : ``;
            await createRedisReminder([
                {
                    id: items[0].goods_id,
                    desired_price: args[1],
                    executed_channel: message.channelID,
                    current_price: items[0].price,
                    Date: Date.now(),
                },
            ]);

            return {
                text: `Reminder set for "${item}" ${isArgs}`,
            };
        }
    },
};
