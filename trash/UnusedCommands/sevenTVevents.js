// const EventSource = require('eventsource');

// exports.init = async () => {
//     const channels = ['kattah'];
//     this.sevenEvents = new EventSource(`https://events.7tv.app/v1/channel-emotes?channel=${channels}`);

//     this.sevenEvents.addEventListener(
//         'ready',
//         (e) => {
//             // Should be "7tv-event-sub.v1" since this is the `v1` endpoint
//             Logger.info('Ready', e.data);
//         },
//         false
//     );

//     this.sevenEvents.addEventListener(
//         'update',
//         (e) => {
//             const data = JSON.parse(e.data);
//             switch (data.action) {
//                 case 'ADD': {
//                     Logger.info(`Added 7tv emote, ${data.name} by ${data.actor} in ${data.channel}`);
//                     break;
//                 }
//                 case 'REMOVE': {
//                     Logger.info(`Removed 7tv + ${data.name} by ${data.actor} in ${data.channel}`);
//                     break;
//                 }
//                 case 'UPDATE': {
//                     Logger.info(
//                         `Updated 7tv emote, ${data.emote.name} to ${data.name} by ${data.actor} in ${data.channel}`
//                     );
//                     break;
//                 }
//             }
//         },
//         false
//     );

//     this.sevenEvents.addEventListener(
//         'open',
//         (e) => {
//             // Connection was opened.
//             Logger.info('Open', e.data);
//         },
//         false
//     );

//     this.sevenEvents.addEventListener(
//         'error',
//         (e) => {
//             if (e.readyState === EventSource.CLOSED) {
//                 // Connection was closed.
//                 Logger.error('7TV Error', e);
//             }
//         },
//         false
//     );

//     this.sevenEvents.addEventListener(
//         'heartbeat',
//         (e) => {
//             // Heartbeat received.
//             lastHeartbeat = Date.now();
//         },
//         false
//     );
// };
