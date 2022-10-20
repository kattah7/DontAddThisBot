const fetch = require('node-fetch');

module.exports = {
    name: 'bttv',
    description: 'Usage: |editor add/remove <username>',
    cooldown: 3000,
    async execute(message, args, client) {
        const bttv = await fetch('https://api.betterttv.net/3/account/editors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.BTTV,
            },
        }).then((res) => res.json());
        const bttvEditors = bttv.map((editor) => editor.id);
        return {
            text: `current editors are: ${bttvEditors.length}`,
        };
    },
};
