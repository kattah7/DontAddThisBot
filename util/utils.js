exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
};

exports.splitArray = (arr, len) => {
    var chunks = [], i = 0, n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
};