const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "ban",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "ban.usage",
	description: "ban.description",
	flags: constants.cmdFlags.guildOnly,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix) {
		if (!message.member.permissions.has("BAN_MEMBERS")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "no_permissions"));
			return message.channel.send(embed);
		}
		
		let findTag = ((args !== undefined) && message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)));
        let member = message.mentions.members.first() || findTag || undefined;
		
		let banReason = client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "no_reason");
		if (args[1]) { banReason = args.slice(1).join(" "); }
		
		if (!member) {
			return message.guild.members.ban(args[0], {days: 0, reason: banReason}).then((user) => {
				let embed = new Discord.MessageEmbed();
				embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "success.title", [user.tag])); // user.tag
				embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "success.reason", [banReason])); // banReason
				embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "success.by", [message.author.tag]), message.author.displayAvatarURL({format: "png", dynamic: true, size: 4096})); // message.author.tag \ message.author.id
				message.channel.send(embed);
			}).catch((error) => {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "dont_exists"));
				embed.setColor([255, 0, 0]);
				message.channel.send(embed);
			});
		}
		
		if (member.user.id === client.user.id) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "myself"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (member.user.id === message.author.id) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "yourself"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (member.user.id === message.guild.ownerID) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "is_ownership"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (!member.bannable) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "cannot_ban"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		member.ban({days: 0, reason: banReason}).then((member) => {
			let embed = new Discord.MessageEmbed();
			embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "success.title", [member.user.tag])); // member.user.tag
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "success.reason", [banReason])); // banReason
			embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands_ban", "success.by", [message.author.tag]), message.author.displayAvatarURL({format: "png", dynamic: true, size: 4096})); // message.author.tag \ message.author.id
			return message.channel.send(embed);
		}).catch((error) => {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(error.name);
			return message.channel.send(embed);
		});
    }
};