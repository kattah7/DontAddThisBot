var re = /[0-9A-Fa-f]{6}/g;
var inputString = 'yo';

if(re.test(inputString)) {
    console.log('valid hex');
} else {
    console.log('invalid');
}

re.lastIndex = 0;