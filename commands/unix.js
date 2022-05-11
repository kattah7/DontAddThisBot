module.exports = {  
    name: "unix",
    aliases: [],
    cooldown: 3000,
    description:"Random unix time lol, The Unix epoch is 00:00:00 UTC on 1 January 1970.",
    execute: async (message, args) => {
        const math = Math.floor(Math.random() * 1999999999);

        let UNIX_timestamp = `${math}`

        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
        var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();

        var formattedTime = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  
        console.log(formattedTime);

        return {
            text: `${message.senderUsername}, ${formattedTime}`,
        };
    },
}
