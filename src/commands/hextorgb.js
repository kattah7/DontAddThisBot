module.exports = {
    tags: 'stats',
    name: 'hex',
    aliases: ['hextorgb'],
    description: 'convert hex to rgb, |hextorgb (hex)',
    cooldown: 5000,
    execute: async (message, args, client, userdata, params) => {
        if (!args[0]) {
            return {
                text: `⛔ No hex specified`,
            };
        }

        const hex = args[0].replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const a = parseInt(hex.substring(6, 8), 16) / 255;

        return {
            text: `r: ${r}, g: ${g}, b: ${b}${isNaN(a.toFixed(2)) ? '' : `, a: ${a.toFixed(2)}`}`,
        };
    },
};
