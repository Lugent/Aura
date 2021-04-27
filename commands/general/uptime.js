const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const os = require("os");
const packages_json = require(process.cwd() + "/package.json");

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); }
module.exports = {
    name: "uptime",
	path: path.basename(__dirname),
    cooldown: 5,
	description: "uptime.description",
    async execute(client, message, args)
    {
		let uptime_count = client.functions.generateDurationString(client, message.author, message.guild, client.readyAt.getTime());
		
        let embed = new Discord.MessageEmbed();
		embed.setAuthor(client.users.cache.get(client.config.owner).tag + "\n" + "(" + client.users.cache.get(client.config.owner).id + ")", client.users.cache.get(client.config.owner).displayAvatarURL({ format: "png", dynamic: true, size: 256 }))
		embed.setTitle(client.user.tag + "\n" + "(" + client.user.id + ")");
        embed.setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
		embed.addField(":gear: " + client.functions.getTranslation(client, message.author, message.guild, "commands_uptime", "embed.software") + ":", ":desktop: " + os.version() + " " + os.arch() + "\n" + ":scroll: " + "Node.js " + process.version + " - " + "discord.js v" + packages_json.dependencies["discord.js"]);
		embed.addField(":file_cabinet: " + client.functions.getTranslation(client, message.author, message.guild, "commands_uptime", "embed.resources_usage") + ":", ":battery: " + client.statsCPU.total.toFixed(2) + "%" + " / " + ":card_box: " + (process.memoryUsage().rss / 1000000).toFixed(2) + "MB", true);
		embed.addField(":satellite: " + client.functions.getTranslation(client, message.author, message.guild, "commands_uptime", "embed.time_connected") + ":", uptime_count, false);
		embed.addField(":calendar_spiral: " + client.functions.getTranslation(client, message.author, message.guild, "commands_uptime", "embed.creation_date") + ":", client.functions.generateDateString(client, message.author, message.guild, client.user.createdAt).capitalize(), false);
		embed.setColor(0x0580aa);
        return message.inlineReply(embed);
    }
};