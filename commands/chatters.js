
module.exports = {
    name: "chatters",
    cooldown: 3000,
    execute: async(message, args) => {
        const targetUser = args[0] ?? message.senderUsername;


  const data = await fetch(`https://recent-messages.robotty.de/api/v2/recent-messages/${targetUser.toLowerCase()}`);
  const resp = JSON.parse(await data.text());

  const messages = resp.messages;
  const users = [];
  const re = /^.+@(.+)\.tmi.twitch.tv\sPRIVMSG\s#.+$/i
 
  for (let message of resp.messages) {
    re.lastIndex = 0;
    const match = re.exec(message);
    if (match) {
      const user = match[1];
      if (!users.includes(user)) {
        users.push(user);
        
        
      }
    }
  } 
  console.log(users.length)
  return {
      text: `${targetUser} currently has ${users.length} chatting`
  }



    }
        }