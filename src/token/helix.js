const got = require('got');

const helix = got.extend({
    prefixUrl: 'https://api.twitch.tv/helix/',
    throwHttpErrors: false,
    responseType: 'json',
    headers: {
        'Client-ID': process.env.CLIENT_ID,
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    },
});

exports.ChangeColor = async (color) => {
    const urlEncodeHex = (hex) => {
        return hex.replace('#', '%23');
    };
    await helix.put(`chat/color?user_id=790623318&color=${urlEncodeHex(color)}`);
};

exports.GetGames = async (name) => {
    const { data } = await helix.get(`games?name=${name}`).json();
    return data;
};

exports.GetStreams = async (number, game) => {
    const { data } = await helix.get(`streams?first=${number}&game_id=${game}`).json();
    return data;
};

exports.Announce = async (channel, args) => {
    await helix.post(`chat/announcements?broadcaster_id=${channel}&moderator_id=790623318`, {
        json: {
            message: args,
            color: 'purple',
        },
    });
};

exports.UserInfo = async (user) => {
    const { data } = await helix.get(`users?login=${user}`).json();
    return data;
};

exports.GetClips = async (channel) => {
    const { data } = await helix.get(`clips?broadcaster_id=${channel}`).json();
    return data;
};

exports.GetStreams = async (channel, Boolean) => {
    // true = login, false = id
    const { data } = await helix.get(`streams?user_${Boolean ? 'login' : 'id'}=${channel}`).json();
    return data;
};
