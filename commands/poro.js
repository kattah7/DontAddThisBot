const humanizeDuration = require("../humanizeDuration");
const utils = require("../util/utils.js");

module.exports = {
    name: "poro",
    cooldown: 10000,
    description: "Get poro meat every 2 hour",
    poro: true,
    execute: async (message, args, client) => {
        const lastUsage = await bot.Redis.get(`poro:${message.senderUserID}`);
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        const random = Math.floor(Math.random() * 27) + -5;
        if (message.channelName == "nymn") {
            if (await utils.Nymn(message.senderUsername) == true) {
                return {
                    text: `Banned Msg lol`
                }
            } else {
                if (!channelData) {
                    const newChannel = new bot.DB.poroCount({
                        username: message.senderUsername,
                        id: message.senderUserID,
                        joinedAt: new Date(),
                        poroCount: 10,
                        poroPrestige: 0,
                    });
                    
                    await newChannel.save();
                    await bot.Redis.set(`poro:${message.senderUserID}`, Date.now(), 0);
                    await bot.Redis.set(`porocdr:${message.senderUserID}`, Date.now(), 0);
        
                    return {
                        text: `New user! ${message.senderUsername} kattahDance2 here is free 10 poro meat 🥩`
                    }
                }
                
                if (lastUsage || channelData) {
                    if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 2) {
                        const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 2;
                            if (message.senderUsername == await utils.PoroNumberOne()) {
                                       client.privmsg(message.channelName, `.me No poros found... 🎇 kattahBoom ${message.senderUsername} | [P:${channelData.poroPrestige}] ${channelData.poroCount.toLocaleString()} meat total! 🥩  | Come back later in ${humanizeDuration(ms)}. kattahDance`)
                                       return
                            } else {
                                return {
                                    text: `No poros found... 🎇 kattahBoom ${message.senderUsername} | [P:${channelData.poroPrestige}] ${channelData.poroCount.toLocaleString()} meat total! 🥩  | Come back later in ${humanizeDuration(ms)}. kattahDance`
                                } 
                            }
                    }
                }
        
                await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount + random } } ).exec();
        
                await bot.Redis.set(`poro:${message.senderUserID}`, Date.now(), 0);
                console.log(random)
                if (random == 5 || random == 6 || random == 7 || random == 8 || random == 9) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Tenderloin Poro kattahStare (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro slaughtered! ${message.senderUsername} --> Tenderloin Poro kattahStare (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`,
                        };
                    }
                } else if (random == 10 || random == 11 || random == 12 || random == 13 || random == 14 || random == 15) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Wagyu Poro 🤤 (+${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro slaughtered! ${message.senderUsername} --> Wagyu Poro 🤤 (+${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                        }
                    }
                } else if (random == -1 || random == -2 || random == -3 || random == -4 || random == -5) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Rotten Poro DansGame (${random}) kattahBAT [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro slaughtered! ${message.senderUsername} --> Rotten Poro DansGame (${random}) kattahBAT [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                        }
                    }
                } else if (random == 1 || random == 2 || random == 3 || random == 4) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Sirloin Poro OpieOP (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro slaughtered! ${message.senderUsername} --> Sirloin Poro OpieOP (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                        }
                    }
                } else if (random == 0) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro gone! ${message.senderUsername} --> Poro ran away haHAA (±${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro gone! ${message.senderUsername} --> Poro ran away haHAA (±${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                        }
                    }
                } else if (random >= 16) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> LEGENDARY PORO VisLaud (+${random}) kattahXd [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro slaughtered! ${message.senderUsername} --> LEGENDARY PORO VisLaud (+${random}) kattahXd [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                        }
                    }
                }
            }
    }
        if (message.channelName == "forsen") {
            if (await utils.ForsenTV(message.senderUsername) == true) {
                return {
                    text: `Banned msg lol`
                }
            } else {
                if (!channelData) {
                    const newChannel = new bot.DB.poroCount({
                        username: message.senderUsername,
                        id: message.senderUserID,
                        joinedAt: new Date(),
                        poroCount: 10,
                        poroPrestige: 0,
                    });
                    
                    await newChannel.save();
                    await bot.Redis.set(`poro:${message.senderUserID}`, Date.now(), 0);
        
                    return {
                        text: `New user! ${message.senderUsername} kattahDance2 here is free 10 poro meat 🥩`
                    }
                }
                
                if (lastUsage || channelData) {
                    if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 2) {
                        const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 2;
                            if (message.senderUsername == await utils.PoroNumberOne()) {
                                       client.privmsg(message.channelName, `.me No poros found... 🎇 kattahBoom ${message.senderUsername} | [P:${channelData.poroPrestige}] ${channelData.poroCount.toLocaleString()} meat total! 🥩  | Come back later in ${humanizeDuration(ms)}. kattahDance`)
                                       return
                            } else {
                                return {
                                    text: `No poros found... 🎇 kattahBoom ${message.senderUsername} | [P:${channelData.poroPrestige}] ${channelData.poroCount.toLocaleString()} meat total! 🥩  | Come back later in ${humanizeDuration(ms)}. kattahDance`
                                } 
                            }
                    }
                }
        
                await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount + random } } ).exec();
        
                await bot.Redis.set(`poro:${message.senderUserID}`, Date.now(), 0);
                console.log(random)
                if (random == 5 || random == 6 || random == 7 || random == 8 || random == 9) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Tenderloin Poro kattahStare (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro slaughtered! ${message.senderUsername} --> Tenderloin Poro kattahStare (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`,
                        };
                    }
                } else if (random == 10 || random == 11 || random == 12 || random == 13 || random == 14 || random == 15) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Wagyu Poro 🤤 (+${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro slaughtered! ${message.senderUsername} --> Wagyu Poro 🤤 (+${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                        }
                    }
                } else if (random == -1 || random == -2 || random == -3 || random == -4 || random == -5) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Rotten Poro DansGame (${random}) kattahBAT [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro slaughtered! ${message.senderUsername} --> Rotten Poro DansGame (${random}) kattahBAT [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                        }
                    }
                } else if (random == 1 || random == 2 || random == 3 || random == 4) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Sirloin Poro OpieOP (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro slaughtered! ${message.senderUsername} --> Sirloin Poro OpieOP (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                        }
                    }
                } else if (random == 0) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro gone! ${message.senderUsername} --> Poro ran away haHAA (±${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro gone! ${message.senderUsername} --> Poro ran away haHAA (±${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                        }
                    }
                } else if (random >= 16) {
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> LEGENDARY PORO VisLaud (+${random}) kattahXd [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                    } else {
                        return {
                            text: `Poro slaughtered! ${message.senderUsername} --> LEGENDARY PORO VisLaud (+${random}) kattahXd [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                        }
                    }
                }
            }
    }
        if (message.channelName == message.channelName) {
            if (!channelData) {
                const newChannel = new bot.DB.poroCount({
                    username: message.senderUsername,
                    id: message.senderUserID,
                    joinedAt: new Date(),
                    poroCount: 10,
                    poroPrestige: 0,
                });
                
                await newChannel.save();
                await bot.Redis.set(`poro:${message.senderUserID}`, Date.now(), 0);
    
                return {
                    text: `New user! ${message.senderUsername} kattahDance2 here is free 10 poro meat 🥩`
                }
            }
            
            if (lastUsage || channelData) {
                if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 2) {
                    const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 2;
                        if (message.senderUsername == await utils.PoroNumberOne()) {
                                   client.privmsg(message.channelName, `.me No poros found... 🎇 kattahBoom ${message.senderUsername} | [P:${channelData.poroPrestige}] ${channelData.poroCount.toLocaleString()} meat total! 🥩  | Come back later in ${humanizeDuration(ms)}. kattahDance`)
                                   return
                        } else {
                            return {
                                text: `No poros found... 🎇 kattahBoom ${message.senderUsername} | [P:${channelData.poroPrestige}] ${channelData.poroCount.toLocaleString()} meat total! 🥩  | Come back later in ${humanizeDuration(ms)}. kattahDance`
                            } 
                        }
                }
            }
    
            await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount + random } } ).exec();
    
            await bot.Redis.set(`poro:${message.senderUserID}`, Date.now(), 0);
            console.log(random)
            if (random == 5 || random == 6 || random == 7 || random == 8 || random == 9) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Tenderloin Poro kattahStare (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                } else {
                    return {
                        text: `Poro slaughtered! ${message.senderUsername} --> Tenderloin Poro kattahStare (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`,
                    };
                }
            } else if (random == 10 || random == 11 || random == 12 || random == 13 || random == 14 || random == 15) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Wagyu Poro 🤤 (+${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                } else {
                    return {
                        text: `Poro slaughtered! ${message.senderUsername} --> Wagyu Poro 🤤 (+${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                    }
                }
            } else if (random == -1 || random == -2 || random == -3 || random == -4 || random == -5) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Rotten Poro DansGame (${random}) kattahBAT [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                } else {
                    return {
                        text: `Poro slaughtered! ${message.senderUsername} --> Rotten Poro DansGame (${random}) kattahBAT [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                    }
                }
            } else if (random == 1 || random == 2 || random == 3 || random == 4) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> Sirloin Poro OpieOP (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                } else {
                    return {
                        text: `Poro slaughtered! ${message.senderUsername} --> Sirloin Poro OpieOP (+${random}) PoroSad [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                    }
                }
            } else if (random == 0) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me Poro gone! ${message.senderUsername} --> Poro ran away haHAA (±${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                } else {
                    return {
                        text: `Poro gone! ${message.senderUsername} --> Poro ran away haHAA (±${random}) kattahHappy [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                    }
                }
            } else if (random >= 16) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me Poro slaughtered! ${message.senderUsername} --> LEGENDARY PORO VisLaud (+${random}) kattahXd [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`)
                } else {
                    return {
                        text: `Poro slaughtered! ${message.senderUsername} --> LEGENDARY PORO VisLaud (+${random}) kattahXd [P:${channelData.poroPrestige}] ${channelData.poroCount + random} meat total!`
                    }
                }
            }
    }
    }
}