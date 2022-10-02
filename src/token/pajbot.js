const got = require('got');

exports.ForsenTV = async (text) => {
    const { banned, banphrase_data } = await got
        .post(`https://forsen.tv/api/v1/banphrases/test `, { json: { message: text } })
        .json();
    return banned;
};

exports.Nymn = async (text) => {
    const { banned, banphrase_data } = await got
        .post(`https://nymn.pajbot.com/api/v1/banphrases/test `, { json: { message: text } })
        .json();
    return banned;
};
