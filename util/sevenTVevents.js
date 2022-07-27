const EventSource = require("eventsource");


exports.init = async () => {
    const channels = ["kattah"];
    this.sevenEvents = new EventSource(`https://events.7tv.app/v1/channel-emotes?channel=${channels}`);

        this.sevenEvents.addEventListener("ready", (e) => {
            // Should be "7tv-event-sub.v1" since this is the `v1` endpoint
            console.log("Ready", e.data);
        }, false);

        this.sevenEvents.addEventListener("update", (e) => {
            const data = JSON.parse(e.data);
            // This is a JSON payload matching the type for the specified event channel
            if (data.action == 'ADD') {
                console.log(`Added 7tv emote, ${data.name} by ${data.actor} in ${data.channel}`);
            }
            else if (data.action == 'REMOVE') {
                console.log(`Removed 7tv + ${data.name} by ${data.actor} in ${data.channel}`);
            } 
            else if (data.action == 'UPDATE') {
                console.log(`Updated 7tv emote, ${data.emote.name} to ${data.name} by ${data.actor} in ${data.channel}`);
            }
        }, false);

        this.sevenEvents.addEventListener("open", (e) => {
            // Connection was opened.
            console.log("Open", e.data);
        }, false);

        this.sevenEvents.addEventListener("error", (e) => {
            if (e.readyState === EventSource.CLOSED) {
                // Connection was closed.
                console.log("7TV Error", e);
            }
        }, false);

        this.sevenEvents.addEventListener("heartbeat", (e) => {
            // Heartbeat received.
            lastHeartbeat = Date.now();
            console.log("Heartbeat", e.data);
        }, false);
    }