const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	name: "ping",
	path: path.basename(__dirname),
    cooldown: 5,
	description: "command.ping.desc",
	execute(client, message, args) {
        var embed = new Discord.MessageEmbed()
		embed.setColor([254, 254, 254])
		embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.ping.loading"));
        message.channel.send(embed).then(async oldmessage => {
            let ping = oldmessage.createdTimestamp - message.createdTimestamp;
			let selfping = client.ws.ping;
            let pingcolor = [254, 254, 254];
            if (ping > 330) { pingcolor = [127, 0, 0]; }
            else if (ping > 225) { pingcolor = [255, 0, 0]; }
            else if (ping > 140) { pingcolor = [255, 255, 0]; }
            else if (ping > 75) { pingcolor = [0, 255, 0]; }
            else if (ping > 30) { pingcolor = [0, 255, 255]; }
            
            var embed = new Discord.MessageEmbed()
			embed.setColor(pingcolor)
			embed.setDescription(":satellite_orbital: " + "Roundtrip Latency: **" + ping + "**ms" + "\n" + ":satellite: " + "Bot Latency: **" + selfping + "**ms");
            oldmessage.edit(embed);
        });
	},
};