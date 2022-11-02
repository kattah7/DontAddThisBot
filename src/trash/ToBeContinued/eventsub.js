const WS = require('ws');
const RWS = require('reconnecting-websocket');

const ws = new RWS('wss://eventsub-beta.wss.twitch.tv/ws', [], {
    WebSocket: WS,
    startedClosed: false,
});

ws.addEventListener('open', () => {
    console.log('Connection opened');
});

ws.addEventListener('close', (data) => {
    console.log('Connection closed', data);
});

ws.addEventListener('message', async (event) => {
    const parsed = JSON.parse(event.data);
    console.log(parsed);
    if (parsed.payload.session.status === 'connected') {
        await new Promise((r) => setTimeout(r, 7000));
        ws.send(
            JSON.stringify({
                type: 'channel.follow',
                version: '1',
                condition: {
                    broadcaster_user_id: '206378648',
                },
                transport: {
                    method: 'websockets',
                    session_id: parsed.payload.session.id,
                },
            })
        );
    }
});
