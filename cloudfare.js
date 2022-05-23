const CloudflareBypasser = require('cloudflare-bypasser');

let cf = new CloudflareBypasser();

cf.request('https://twitchtracker.com/api/channels/summary/xqc')
.then(res => {
  console.log(res)
});
