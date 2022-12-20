const got = require('got');

module.exports = {
	name: 'eval',
	description: 'eval something',
	cooldown: 3000,
	aliases: ['ev'],
	kattah: true,
	async execute(client, msg) {
		const args = msg.args;
		if (args.includes('sudo')) return;

		try {
			let ev;
			if (args[0].startsWith('http')) {
				const res = await got(args[0]);
				ev = await eval('(async () => {' + res.body.replace(/„|“/gm, '"') + '})()');
			} else {
				ev = await eval('(async () => {' + args.join(' ').replace(/„|“/gm, '"') + '})()');
			}
			if (!ev) return null;
			return { text: String(ev), reply: false };
		} catch (e) {
			return {
				text: `error: ${e}`,
				reply: true,
			};
		}
	},
};
