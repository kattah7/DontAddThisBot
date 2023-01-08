const RWS = require('reconnecting-websocket');
const { Logger, LogLevel } = require('../misc/logger');

function createString() {
	return Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
}

exports.stable = async (message) => {
	return new Promise((resolve, reject) => {
		const WS = new RWS('wss://stabilityai-stable-diffusion-1.hf.space/queue/join', [], {
			WebSocket: require('ws'),
			startedClosed: true,
		});

		let response = {
			output: null,
			code: createString(),
		};

		WS.addEventListener('open', () => {
			Logger.log(LogLevel.DEBUG, `Stable Diffusion: Connected`);
		});

		WS.addEventListener('message', ({ data }) => {
			const { msg, output, success } = JSON.parse(data);
			switch (msg) {
				case 'send_hash': {
					WS.send(
						JSON.stringify({
							fn_index: 2,
							session_hash: createString(),
						}),
					);
					break;
				}

				case 'send_data': {
					WS.send(
						JSON.stringify({
							fn_index: 2,
							session_hash: createString(),
							data: [message],
						}),
					);
					break;
				}

				case 'process_completed': {
					WS.close();
					if (success) response.output = output;
					resolve(response);
					break;
				}
			}
		});

		WS.addEventListener('close', () => {
			Logger.log(LogLevel.DEBUG, `Stable Diffusion: Disconnected`);
		});
	});
};
