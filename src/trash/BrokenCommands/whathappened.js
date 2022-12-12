module.exports = {
	tags: 'stats',
	name: 'whathappen',
	aliases: ['wh'],
	cooldown: 3000,
	description: 'Tells you what happened on that date of history.[Usage |wh (month) (day), |whathappened (month) (day), |whathappen (month) (day) ',
	execute: async (message, args, client) => {
		const MONTH = args[0];
		const DAY = args[1];
		if (!MONTH) {
			return {
				text: `Pls insert date, |wh (month) (date)`,
			};
		}
		if (!DAY) {
			return {
				text: `Pls insert Day, |wh (month) (date)`,
			};
		}
		if (args[2]) {
			return {
				text: `Pls insert only month and date, |wh (month) (date)`,
			};
		}

		const res = await fetch(`https://byabbe.se/on-this-day/${MONTH}/${DAY}/events.json`);
		const user = await res.json();
		var random = user.events[Math.floor(Math.random() * user.events.length)];
		//console.log(random)
		return {
			text: `What happened on ${user.date} ${random.year}? ${random.description} BatChest`,
		};
	},
};
