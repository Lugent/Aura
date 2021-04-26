const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	name: "emoji",
	path: path.basename(__dirname),
    cooldown: 6,
	description: "emoji.description",
	async execute(client, message, args, prefix) {
		if (message.channel.type !== "text") {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_emoji", "no_guild"));
			embed.setColor([255, 0, 0]);
			return message.inlineReply(embed);
		}
		
		if (!message.member.permissions.has("MANAGE_EMOJIS")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry:" + client.functions.getTranslation(client, message.author, message.guild, "no_permissions"));
			embed.setColor([255, 0, 0]);
			return message.inlineReply(embed);
		}
		
		if (!args.length) {
			return message.inlineReply("** **");
		}
		
		switch (args[0]) {
			case "add": {
				switch (message.guild.premiumTier) {
					case 0: {
						if (message.guild.emojis.cache.size >= 50) {
							return message.inlineReply("** **");
						}
						break;
					}
					
					case 1: {
						if (message.guild.emojis.cache.size >= 100) {
							return message.inlineReply("** **");
						}
						break;
					}
					
					case 2: {
						if (message.guild.emojis.cache.size >= 150) {
							return message.inlineReply("** **");
						}
						break;
					}
					
					case 3: {
						if (message.guild.emojis.cache.size >= 250) {
							return message.inlineReply("** **");
						}
						break;
					}
				}
				
				if (!args[1]) {
					return message.inlineReply("** **");
				}
				
				if (!args[2]) {
					return message.inlineReply("** **");
				}
				
				let emoji_name = args[1];
				let emoji_url = args[2];
				message.guild.emojis.create(emoji_url, emoji_name, {reason: "Emoji uploaded by " + message.author.tag}).then((emoji) => {
					return message.inlineReply("** **");
				}).catch((error) => {
					console.error(error);
					return message.inlineReply("** **");
				});
				break;
			}
		}
	}
}