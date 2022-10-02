const { client } = require('../util/connections.js');
const { StvInformation, StvEmoteInformation } = require('../token/stvREST.js');
const { ParseUser, IDByLogin, stvNameToID } = require('../util/utils.js');
const got = require('got');

const WHISPER = async function () {
    client.on('WHISPER', async ({ messageText, senderUsername, senderUserID }) => {
        const { user } = await StvInformation(senderUserID);
        const values = {
            '60724f65e93d828bf8858789': 0, // Moderator
            '631ef5ea03e9beb96f849a7e': 1, // Evenet coordinator
            '63124dcf098bd6b8e5a7cb02': 2, // Staff
            '6102002eab1aa12bf648cfcd': 3, // Admin
            '608831312a61f51b61f2974d': 4, // Dungeon Mistress
        };
        // return by user values or -1
        const userRole = user?.roles?.map((role) => values[role])?.sort((a, b) => a - b)?.[0] ?? -1;
        if (userRole > -1) {
            const args = messageText.slice().trim().split(/ +/g);
            const [url] = args;
            if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(url)) {
                const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(url);
                const emoteInfo = await StvEmoteInformation(linkEmote[2]);
                if (emoteInfo == null) return client.whisper(senderUsername, 'Unknown emote');
                const findBadApple = await bot.DB.moderation.findOne({ StvID: emoteInfo.owner.id }).exec();
                if (findBadApple) {
                    const { username, id, StvID, warnings } = findBadApple;
                    const warnList = warnings.map((warn) => {
                        return `Warned by ${warn.warnedBy} for "${warn.reason}" at "${warn.warnedAt}"`;
                    });
                    var paste = await got
                        .post('https://paste.ivr.fi/documents', {
                            body: `Username: ${username} \nID: ${id} \nStvID: "${StvID}" \n\n${warnList.join(
                                '\n'
                            )} \n\nNote that this link will never expire.`,
                        })
                        .json();
                }
                await client.whisper(
                    senderUsername,
                    emoteInfo.owner.id === '000000000000000000000000'
                        ? 'Deleted User'
                        : findBadApple
                        ? `${emoteInfo.owner.username} is a bad apple! monkaS Total of ${
                              findBadApple.warnings.length
                          } warning${findBadApple.warnings.length > 1 ? `s` : ``}; https://paste.ivr.fi/${paste.key}`
                        : `${emoteInfo.owner.username} is not a bad apple :)`
                );
            }

            if (args[0] === 'warn') {
                const [warn, user, ...reason] = args;
                if (!user) return client.whisper(senderUsername, 'Please provide a user');
                if (args[1] == 'warn') return client.whisper(senderUsername, 'Usage warn <user> <reason>');
                if (!args[2]) return client.whisper(senderUsername, 'Please provide a reason');
                const parseUser = await ParseUser(user);
                try {
                    const uid = await IDByLogin(parseUser);
                    if (uid == null) return client.whisper(senderUsername, 'Unknown user on Twitch');
                    const stvID = await stvNameToID(uid);
                    if (stvID == null) return client.whisper(senderUsername, 'Unknown user on 7TV');
                    const isWarnedAlready = await bot.DB.moderation.findOne({ StvID: stvID });
                    if (!isWarnedAlready) {
                        const warnUser = new bot.DB.moderation({
                            username: parseUser.toLowerCase(),
                            id: uid,
                            StvID: stvID,
                            warnings: [
                                {
                                    reason: reason.join(' '),
                                    warnedAt: new Date(),
                                    warnedBy: senderUsername,
                                },
                            ],
                        });
                        await warnUser.save();
                        await client.whisper(senderUsername, `Warned ${parseUser} for ${reason.join(' ')}`);
                    } else {
                        isWarnedAlready.warnings.push({
                            reason: reason.join(' '),
                            warnedAt: new Date(),
                            warnedBy: senderUsername,
                        });
                        await isWarnedAlready.save();
                        await client.whisper(
                            senderUsername,
                            `Warned ${parseUser} for ${reason.join(' ')}, this user has ${
                                isWarnedAlready.warnings.length
                            } warnings`
                        );
                    }
                } catch (err) {
                    client.whisper(senderUsername, 'Something went wrong');
                }
            } else if (args[0] === 'info') {
                const [warn, user] = args;
                if (!user) return client.whisper(senderUsername, 'Please provide a user');
                const parseUser = await ParseUser(user);
                const findUser = await bot.DB.moderation.findOne({ username: parseUser.toLowerCase() });
                if (!findUser) return client.whisper(senderUsername, `User "${parseUser}" not found`);
                const { username, id, StvID, warnings } = findUser;
                // list all warnings and user info nicely and post it to paste.ivr.fi with got post
                const warnList = warnings.map((warn) => {
                    return `Warned by ${warn.warnedBy} for "${warn.reason}" at "${warn.warnedAt}"`;
                });
                const paste = await got
                    .post('https://paste.ivr.fi/documents', {
                        body: `Username: ${username} \nID: ${id} \nStvID: "${StvID}" \n\n${warnList.join(
                            '\n'
                        )} \n\nNote that this link will never expire.`,
                    })
                    .json();
                await client.whisper(
                    senderUsername,
                    `${username} has total of ${warnings.length} warning${
                        warnings.length > 1 ? `s` : ``
                    }; https://paste.ivr.fi/${paste.key}`
                );
            } else if (args[0] === 'help') {
                await client.whisper(
                    senderUsername,
                    `warn <user> <reason> - Warn a user; info <user> - Get info about a user; <emote link> - Check if a user is a bad apple`
                );
            }
        }
    });
};

module.exports = { WHISPER };
