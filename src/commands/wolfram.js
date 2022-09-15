const fetch = require('node-fetch');

module.exports = {
    name: 'wolfram',
    aliases: ['query'],
    cooldown: 3000,
    description: 'search anything and get a answer',
    execute: async (message, args, client) => {
        const prompt = args.join(' ');
        const url = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
        const params = {
            prompt: prompt,
            max_tokens: 160,
            temperature: 0,
            frequency_penalty: 0.0,
            top_p: 1,
            presence_penalty: 0.0,
        };
        const headers = {
            'Authorization': `Bearer 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`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(params),
            });
            const data = await response.json();
            const output = `${data.choices[0].text}`.substring(prompt.length).replace(/gpt-3/gi, 'Wolfram');
            return {
                text: output,
            };
        } catch (error) {
            console.log(error);
        }
    },
};
