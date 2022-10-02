const got = require('got');

exports.egVault = async (stvID) => {
    if (!stvID) return null;
    const egVault = await got(`https://egvault.7tv.io/v1/subscriptions/${encodeURIComponent(stvID)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!egVault.body) return null;
    return egVault.body;
};
