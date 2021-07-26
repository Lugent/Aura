const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const bot_functions = require(process.cwd() + "/configurations/functions.js");
module.exports = {
    name: "prefix",
	path: path.basename(__dirname),
    cooldown: 1,
	description: "prefix.description",
	flags: constants.cmdFlags.cantDisable,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix) {
		if (!message.guild) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/prefix", "no_guild"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}
		
		if (!args[0]) {
			let guild_settings = client.server_data.prepare("SELECT prefix FROM settings WHERE guild_id = ?;").get(message.guild.id); //client.server_prefix.select.get(message.guild.id);
			let embed = new Discord.MessageEmbed();
			embed.setColor(0x66b3ff);
			if (guild_settings) {
				embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/administration/prefix", "title", [guild_settings.prefix]) + "\n" + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/prefix", "description", [guild_settings.prefix]));
			}
			else {
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/prefix", "no_data"));
				embed.setColor([255, 0, 0]);
			}
			return message.channel.send({embeds: [embed]});
		}
		
		let new_prefix = args[0];
		client.server_data.prepare("UPDATE settings SET prefix = ? WHERE guild_id = ?;").run(new_prefix, message.guild.id);
		
		let embed = new Discord.MessageEmbed();
		embed.setColor([0, 255, 0]);
		embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/prefix", "changed", [new_prefix])); // prefix
		return message.channel.send({embeds: [embed]});
	}
};