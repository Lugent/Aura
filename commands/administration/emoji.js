const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	name: "emoji",
	path: path.basename(__dirname),
    cooldown: 6,
	description: "emoji.description",
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
		if (message.channel.type !== "text") {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "no_guild"));
			embed.setColor([255, 0, 0]);
			return message.inlineReply(embed);
		}
		
		if (!message.member.permissions.has("MANAGE_EMOJIS")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "no_permissions"));
			embed.setColor([255, 0, 0]);
			return message.inlineReply(embed);
		}
		
		if (!args.length) {
			let subcommands_name = "";
			let subcommands_list = [
				"add <name> <url>"
			];

			for (let subcommands_list_index = 0; subcommands_list_index < subcommands_list.length; subcommands_list_index++) {
				subcommands_name += "**" + prefix + "emoji" + " " + subcommands_list[subcommands_list_index] + "**" + "\n";
			}

			let embed = new Discord.MessageEmbed();
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "subcommands"), subcommands_name);
			embed.setColor([255, 0, 255]);
			return message.inlineReply(embed);
		}
		
		switch (args[0]) {
			case "add": {
				switch (message.guild.premiumTier) {
					case 0: {
						if (message.guild.emojis.cache.size >= 50) {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "no_free_space", [50]));
							embed.setColor([255, 0, 0]);
							return message.inlineReply(embed);
						}
						break;
					}
					
					case 1: {
						if (message.guild.emojis.cache.size >= 100) {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "no_free_space", [100]));
							embed.setColor([255, 0, 0]);
							return message.inlineReply(embed);
						}
						break;
					}
					
					case 2: {
						if (message.guild.emojis.cache.size >= 150) {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "no_free_space", [150]));
							embed.setColor([255, 0, 0]);
							return message.inlineReply(embed);
						}
						break;
					}
					
					case 3: {
						if (message.guild.emojis.cache.size >= 250) {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "no_free_space", [250]));
							embed.setColor([255, 0, 0]);
							return message.inlineReply(embed);
						}
						break;
					}
				}
				
				if (!args[1]) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "add.no_name"));
					embed.setColor([255, 0, 0]);
					return message.inlineReply(embed);
				}
				
				if (!args[2]) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "add.no_url"));
					embed.setColor([255, 0, 0]);
					return message.inlineReply(embed);
				}
				
				let emoji_name = args[1];
				let emoji_url = args[2];
				message.guild.emojis.create(emoji_url, emoji_name, {reason: client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "uploaded.log", [message.author.tag])}).then((emoji) => {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "uploaded"), [emoji_name]);
					embed.setColor([255, 0, 0]);
					return message.inlineReply(embed);
				}).catch((error) => {
					console.error(error);
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/emoji", "upload_error"));
					embed.setColor([255, 0, 0]);
					return message.inlineReply(embed);
				});
				break;
			}
		}
	}
};