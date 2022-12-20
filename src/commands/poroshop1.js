module.exports = {
	tags: 'poro',
	name: 'poroshop',
	cooldown: 5000,
	description: 'poro shop information to use poro meat',
	aliases: ['shop'],
	execute() {
		return {
			text: `kattahDance |setcolor (50 🥩); |cdr (5 🥩); |rankup; deactivate bot :tf: (1mill 🥩)`,
			reply: true,
		};
	},
};
