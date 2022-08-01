const got = require('got');
const keepAliveAgent = new got.Agent({ keepAlive: true });
got.request({ agent: keepAliveAgent })
