const { exec } = require("child_process");

module.exports = {
    name: 'test123123',
    cooldown: 5000,
    description: 'Test',
    execute: async(message, args, client) => {
        const storageMB = await exec("cd /home/justlog/logs && du -d 1 h", (err) => {
            if (err) {
                Logger.error(err);
                return {
                    text: `error`,
                };
            }
        });

        return {
            text: `Storage: ${storageMB}`,
        }

    }
}