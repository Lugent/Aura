const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "uptime",
	path: path.basename(__dirname),
    //aliases: ["profile"],
    cooldown: 5,
    //usage: "[usuario]",
	description: "command.uptime.desc",
    async execute(client, message, args)
    {
		let uptimeSeconds = (client.uptime / 1000);
		let uptimeMinutes = (uptimeSeconds / 60);
		let uptimeHours = (uptimeMinutes / 60);
		let uptimeDays = (uptimeHours / 24);
		
        let embed = new Discord.MessageEmbed();
		embed.setTitle(client.user.tag);
        embed.setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
		embed.addField(":battery: " + client.utils.getTrans(client, message.author, message.guild, "command.uptime.embed.cpuusage") + ":", client.statsCPU.total.toFixed(2) + "%", true);
		embed.addField(":card_box: " + client.utils.getTrans(client, message.author, message.guild, "command.uptime.embed.ramusage") + ":", (process.memoryUsage().rss / 1000000).toFixed(2) + "MB", true);
		embed.addField(":satellite: " + client.utils.getTrans(client, message.author, message.guild, "command.uptime.embed.timeconnected") + ":", client.utils.getTrans(client, message.author, message.guild, "command.uptime.embed.timeconnected.field", [uptimeDays.toFixed(0), (uptimeHours.toFixed(0) % 24), (uptimeMinutes.toFixed(0) % 60), (uptimeSeconds.toFixed(0) % 60)]), false); // uptimeDays.toFixed(0) \ (uptimeHours.toFixed(0) % 24) \ (uptimeMinutes.toFixed(0) % 60) \ (uptimeSeconds.toFixed(0) % 60)
		embed.addField(":calendar_spiral: " + client.utils.getTrans(client, message.author, message.guild, "command.uptime.embed.createddate") + ":", client.user.createdAt.toString(), false);
        embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.uptime.embed.id") + ": " + client.user.id);
		embed.setColor(0x66b3ff);
        return message.channel.send(embed);
    }
};