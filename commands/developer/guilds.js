const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	name: "guilds",
	path: path.basename(__dirname),
	description: "command.guilds.desc",
	aliases: ["servers"],
	flags: constants.cmdFlags.ownerOnly,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args) {
		let guild_count = client.guilds.cache.array().length;
		let embed = new Discord.MessageEmbed();
		embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands_guilds", "embed.title") + ":");

		let guilds_array = client.guilds.cache.array();
		for (let guild_index = 0; guild_index < guilds_array.length; guild_index++) {
			let guild_element = guilds_array[guild_index];
			embed.addField(guild_element.name, guild_element.id, false);
		}

		embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands_guilds", "embed.footer", [guild_count]));
		return message.channel.send({embed: embed});
	},
}; 