module.exports = {
    name: 'poki',
    description: 'poki',
    cooldown: 5000,
    execute: async (message, args, client) => {
        const { senderUserID, channelID } = message;
        if ((senderUserID != '125906038' && senderUserID != '137199626') || channelID != '137199626') return;
        await client.say(
            message.channelName,
            `zz zz zz zz p1 p2 p3 p4 p5 p6 p7 p8 test6 p9 10 11 12 13 14 15 16 17 18 19 zz zz zz zz zz zz`
        );
        await client.say(
            message.channelName,
            `zz zz zz 20 21 22 test7 test8 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 zz zz zz zz`
        );
        await client.say(
            message.channelName,
            `zz zz zz 41 test9 43 test4 44 45 46 test10 48 49 50 51 52 53 54 55 56 57 58 59 60 61 zz zz zz zz zz`
        );
        await client.say(
            message.channelName,
            `zz zz 62 63 64 65 66 67 68 69 70 test11 72 73 74 75 76 77 78 79 80 81 82 83 84 zz zz zz zz zz`
        );
        await client.say(
            message.channelName,
            `zz zz 85 86 87 88 89 90 92 93 94 test12 95 96 97 98 99 100 101 102 103 104 105 106 107 108 zz zz zz zz`
        );
        await client.say(
            message.channelName,
            `zz zz 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 zz zz`
        );
    },
};
