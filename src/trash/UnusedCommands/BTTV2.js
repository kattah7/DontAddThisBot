const fetch = require('node-fetch');

module.exports = {
	name: 'bttv2',
	description: 'Usage: |editor add/remove <username>',
	cooldown: 3000,
	async execute(message, args, client) {
		let currentCursor = '';
		const bttv = await fetch('https://api.betterttv.net/3/emotes/shared?limit=100', {
			method: 'GET',
		}).then((res) => res.json());
		currentCursor = '6288bbc53c6f14b688485cba';
		async function nextBttvPage() {
			const getNextBttvEmotePage = await fetch(
				`https://api.betterttv.net/3/emotes/shared?before=${currentCursor}&limit=100`,
				{
					method: 'GET',
				},
			).then((res) => res.json());
			if (typeof getNextBttvEmotePage[99] !== 'undefined') {
				currentCursor = getNextBttvEmotePage[99].id;
				console.log(getNextBttvEmotePage);
			}

			if (getNextBttvEmotePage.length > 0) {
				bttv.push(...getNextBttvEmotePage);
			}

			let nextIndex = 0;
			let total = 0;
			for (const emote of getNextBttvEmotePage) {
				const xd = await fetch(
					`https://api.betterttv.net/3/account/editors/${emote.user.id}`,
					{
						method: 'PUT',
						headers: {
							Authorization: process
								.env
								.BTTV,
						},
					},
				).then((res) => res.json());
				console.log(xd);
				nextIndex++;
				console.log(
					`Added ${xd.name}, ${nextIndex} / ${getNextBttvEmotePage.length}`,
				);
				if (nextIndex === getNextBttvEmotePage.length) {
					total += 1;
					console.log(`next page ${total}`);
					nextBttvPage();
				}
			}
		}
		nextBttvPage();
	},
};
