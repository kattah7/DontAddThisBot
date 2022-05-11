"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandConfig = exports.expandRateLimitsConfig = exports.expandTransportConfig = void 0;
const set_defaults_1 = require("../utils/set-defaults");
const message_rate_limits_1 = require("./message-rate-limits");
const defaults = {
    username: "justinfan12345",
    password: undefined,
    requestMembershipCapability: false,
    maxChannelCountPerConnection: 90,
    connection: {
        type: "tcp",
        secure: true,
    },
    connectionRateLimits: {
        parallelConnections: 1,
        releaseTime: 2000, // 2 seconds
    },
    installDefaultMixins: true,
    ignoreUnhandledPromiseRejections: false,
};
function expandTransportConfig(config) {
    if (config == null) {
        return expandTransportConfig({
            secure: true,
        });
    }
    switch (config.type) {
        case "tcp":
        case undefined: {
            let host;
            let port;
            if ("host" in config && "port" in config) {
                host = config.host;
                port = config.port;
            }
            else {
                host = "irc.chat.twitch.tv";
                port = config.secure ? 6697 : 6667;
            }
            return {
                type: "tcp",
                secure: config.secure,
                host,
                port,
                preSetup: false,
            };
        }
        case "duplex":
            return (0, set_defaults_1.setDefaults)(config, { preSetup: false });
        case "websocket": {
            let url;
            if ("url" in config) {
                url = config.url;
            }
            else {
                url = (config.secure ? "wss" : "ws") + "://irc-ws.chat.twitch.tv";
            }
            return {
                type: "websocket",
                url,
                preSetup: false,
            };
        }
        default:
            throw new Error("Unknown transport type");
    }
}
exports.expandTransportConfig = expandTransportConfig;
function expandRateLimitsConfig(config) {
    if (config == null) {
        return message_rate_limits_1.messageRateLimitPresets.default;
    }
    if (typeof config === "string") {
        return message_rate_limits_1.messageRateLimitPresets[config];
    }
    else {
        return config;
    }
}
exports.expandRateLimitsConfig = expandRateLimitsConfig;
function expandConfig(config) {
    const newConfig = (0, set_defaults_1.setDefaults)(config, defaults);
    newConfig.username = newConfig.username.toLowerCase();
    newConfig.connection = expandTransportConfig(newConfig.connection);
    newConfig.rateLimits = expandRateLimitsConfig(newConfig.rateLimits);
    return newConfig;
}
exports.expandConfig = expandConfig;
//# sourceMappingURL=expanded.js.map