const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "kick",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "kick.usage",
	description: "kick.description",
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix) {
		if (message.channel.type !== "text") {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "no_text_channel"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}

		if (!message.member.permissions.has("KICK_MEMBERS")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "no_permissions"));
			return message.channel.send(embed);
		}
		
		if (!args[0]) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "no_target"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}

		let find_member;
		if (args[0]) { find_member = message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
		
		let mentioned_member = message.mentions.members.first();
        let member = mentioned_member || find_member;
		
		let kick_reason = client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "no_reason");
		if (args[1]) { kick_reason = args.slice(1).join(" "); }
		
		if (!member) {
			if (args[0]) {
				member = await message.guild.members.fetch(args[0]);
			}
			else {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "dont_exists"));
				embed.setColor([255, 0, 0]);
				return message.channel.send(embed);
			}
		}
		
		if (member.user.id === client.user.id) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "myself"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (member.user.id === message.author.id) {
			if (member.user.id === message.guild.ownerID) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "yourself.ownership"));
				embed.setColor([255, 0, 0]);
				return message.channel.send(embed);
			}
			else {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "yourself"));
				embed.setColor([255, 0, 0]);
				return message.channel.send(embed);
			}
		}
		
		if (member.user.id === message.guild.ownerID) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "is_ownership"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (!member.kickable) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "cannot_kick"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		member.kick(kick_reason).then((member) => {
			let embed = new Discord.MessageEmbed();
			embed.setThumbnail(member.user.displayAvatarURL({format: "png", dynamic: true, size: 4096}));
			embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "success.title", [member.user.tag])); // member.user.tag
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "success.reason", [kick_reason])); // kick_reason
			embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "success.operator", [message.author.tag]), message.author.displayAvatarURL({format: "png", dynamic: true, size: 4096})); // message.author.tag \ message.author.id
			return message.channel.send(embed);
		}).catch((error) => {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_kick", "fatal_error"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		});
    }
};