const CODE_LENGTH = 6;
const CODE_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

for (let i = 0; i < CODE_CHARS.length ** CODE_LENGTH; i++) {
    let code = '';
    let j = i;
    for (let k = 0; k < CODE_LENGTH; k++) {
        code += CODE_CHARS[j % CODE_CHARS.length];
        j = Math.floor(j / CODE_CHARS.length);
    }
    console.log(code);
}
