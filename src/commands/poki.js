module.exports = {
    name: 'poki',
    description: 'poki',
    cooldown: 5000,
    execute: async (message, args, client) => {
        const { senderUserID, channelID } = message;
        if ((senderUserID != '125906038' && senderUserID != '137199626') || channelID != '137199626') return;
        await client.say(
            message.channelName,
            `zz zz zz zz zz zz p1 p2 p3 p4 p5 p6 p7 p8 test6 p9 10 11 12 13 14 15 16 17 18 19 zz zz zz zz zz zz` // 1
        );
        await client.say(
            message.channelName,
            `zz zz zz zz zz 20 21 22 test7 test8 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 zz zz zz zz` // 2
        );
        await client.say(
            message.channelName,
            `zz zz zz zz zz 41 test9 43 test4 44 45 46 test10 48 49 50 51 52 53 54 55 56 57 58 59 60 61 zz zz zz zz zz` // 3
        );
        await client.say(
            message.channelName,
            `zz zz zz zz 62 63 64 65 66 67 68 69 70 test11 72 73 74 75 76 77 78 79 80 81 82 83 84 zz zz zz zz zz` // 4
        );
        await client.say(
            message.channelName,
            `zz zz zz zz 85 86 87 88 89 90 92 93 94 test12 95 96 97 98 99 100 101 102 103 104 105 106 107 108 zz zz zz zz` // 5
        );
        await client.say(
            message.channelName,
            `zz zz zz zz 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 test13 129 130 131 zz zz` // 6
        );
        await client.say(
            message.channelName,
            `zz zz zz 132 133 134 135 136 137 138 139 140 141 142 143 145 146 147 148 149 150 151 152 153 154 test15 155 156 zz zz` // 7
        );
        await client.say(
            message.channelName,
            `zz zz 157 158 159 160 161 162 163 164 165 166 167 168 169 170 171 172 173 174 175 test16 178 179 180 181 182 183 184 zz zz` // 8
        );
        await client.say(
            message.channelName,
            `zz zz 185 187 188 189 190 191 192 193 194 195 196 197 198 199 200 201 202 203 204 205 206 207 208 209 210 211 212 zz zz` // 9
        );
        await client.say(
            message.channelName,
            `zz zz 213 215 216 217 test17 219 220 221 222 223 224 225 226 227 228 229 230 231 232 234 235 236 237 238 239 240 241 242 zz zz` // 10
        );
        await client.say(
            message.channelName,
            `zz 243 244 245 246 247 248 249 250 251 252 253 255 256 257 258 259 260 261 262 263 264 265 266 267 268 269 270 271 272 zz zz` // 10
        );
    },
};
