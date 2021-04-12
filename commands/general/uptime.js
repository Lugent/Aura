const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const os = require("os");
const packages_json = require(process.cwd() + "/package.json");

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = {
    name: "uptime",
	path: path.basename(__dirname),
    //aliases: ["profile"],
    cooldown: 5,
    //usage: "[usuario]",
	description: "command.uptime.desc",
    async execute(client, message, args)
    {
		let uptime_seconds = (client.uptime / 1000);
		let uptime_minutes = (uptime_seconds / 60);
		let uptime_hours = (uptime_minutes / 60);
		let uptime_days = (uptime_hours / 24);
		
        let embed = new Discord.MessageEmbed();
		embed.setAuthor(client.users.cache.get(client.config.owner).tag + "\n" + "(" + client.users.cache.get(client.config.owner).id + ")", client.users.cache.get(client.config.owner).displayAvatarURL({ format: "png", dynamic: true, size: 256 }))
		embed.setTitle(client.user.tag + "\n" + "(" + client.user.id + ")");
        embed.setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
		embed.addField(":gear: " + client.utils.getTrans(client, message.author, message.guild, "command.uptime.result.software") + ":", ":desktop: " + os.version() + " " + os.arch() + "\n" + ":scroll: " + "Node.js " + process.version + " - " + "discord.js v" + packages_json.dependencies["discord.js"]);
		embed.addField(":file_cabinet: " + client.utils.getTrans(client, message.author, message.guild, "command.uptime.result.resources_usage") + ":", ":battery: " + client.statsCPU.total.toFixed(2) + "%" + " / " + ":card_box: " + (process.memoryUsage().rss / 1000000).toFixed(2) + "MB", true);
		embed.addField(":satellite: " + client.utils.getTrans(client, message.author, message.guild, "command.uptime.result.time_connected") + ":", client.utils.getTrans(client, message.author, message.guild, "command.uptime.result.time_connected.field", [uptime_days.toFixed(0), (uptime_hours.toFixed(0) % 24), (uptime_minutes.toFixed(0) % 60), (uptime_seconds.toFixed(0) % 60)]), false);
		embed.addField(":calendar_spiral: " + client.utils.getTrans(client, message.author, message.guild, "command.uptime.result.creation_date") + ":", client.functions.generateDateString(client, message.author, message.guild, client.user.createdAt).capitalize(), false);
		embed.setColor(0x0580aa);
        return message.channel.send(embed);
    }
};