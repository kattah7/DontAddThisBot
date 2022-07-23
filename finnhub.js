const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "cbdhf92ad3i64n13odo0"
const finnhubClient = new finnhub.DefaultApi()

finnhubClient.quote("RBLX", (error, data, response) => {
  console.log(data)
});

const kekw = finnhubClient.quote("RBLX")
console.log(kekw)
