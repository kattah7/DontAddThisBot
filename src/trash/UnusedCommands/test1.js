require("dotenv").config();
const WebSocket = require('ws');
const RWS = require('reconnecting-websocket');
const utils = require('./util/utils.js');

const GQL = {
    CONNECTION_INIT: 'connection_init',
    CONNECTION_ACK: 'connection_ack',
    CONNECTION_ERROR: 'connection_error',
    CONNECTION_KEEP_ALIVE: 'ka',
    START: 'start',
    STOP: 'stop',
    CONNECTION_TERMINATE: 'connection_terminate',
    DATA: 'data',
    ERROR: 'error',
    COMPLETE: 'complete'
  }
  

const ws = new WebSocket(`wss://7tv.io/v3/gql`);
ws.addEventListener('open', function open() {
  ws.send(JSON.stringify({
    type: GQL.CONNECTION_INIT,
    payload: process.env.STV_AUTH
}));
  console.log(`7TV Connected`)
});

ws.addEventListener('message', ({ data }) => {
    const msg = JSON.parse(data);
});

ws.addEventListener('error', (e) => {
    console.error(e)
});

ws.addEventListener('close', () => {
    console.log(`7TV Disconnected`)
});