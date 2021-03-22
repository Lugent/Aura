const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	name: "guilds",
	path: path.basename(__dirname),
	description: "command.guilds.desc",
	aliases: ["servers"],
	flags: constants.cmdFlags.ownerOnly,
	execute(client, message, args) {
		let guild_count = client.guilds.cache.array().length;
		let embed = new Discord.MessageEmbed();
		embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.guilds.embed.title") + ":");

		let guilds_array = client.guilds.cache.array();
		for (let guild_index = 0; guild_index < guilds_array.length; guild_index++) {
			let guild_element = guilds_array[guild_index];
			embed.addField(guild_element.name, guild_element.id, false);
		}
		
		embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.guilds.embed.footer", [guild_count]));
		return message.channel.send(embed);
	},
};