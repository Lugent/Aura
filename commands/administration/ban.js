const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "ban",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "command.ban.usage",
	description: "command.ban.desc",
	flags: constants.cmdFlags.guildOnly,
    async execute(client, message, args) {
		if (!message.member.permissions.has("BAN_MEMBERS")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.ban.error.noperms"));
			return message.channel.send(embed);
		}
		
		let findTag = ((args !== undefined) && message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)));
        let member = message.mentions.members.first() || findTag || undefined;
		
		let banReason = client.utils.getTrans(client, message.author, message.guild, "command.ban.noreason");
		if (args[1]) { banReason = args.slice(1).join(" "); }
		
		if (!member) {
			return message.guild.members.ban(args[0], {days: 0, reason: banReason}).then((user) => {
				let embed = new Discord.MessageEmbed();
				embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.ban.success.title", [user.tag])); // user.tag
				embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.ban.success.reason", [banReason])); // banReason
				embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.ban.success.by", [message.author.tag, message.author.id])); // message.author.tag \ message.author.id
				message.channel.send(embed);
			}).catch((error) => {
				let embed = new Discord.MessageEmbed();
				embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.ban.error.dontexists.title"));
				embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.ban.error.dontexists.desc"));
				embed.setColor([255, 0, 0]);
				message.channel.send(embed);
			});
		}
		
		if (member.user.id === client.user.id) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.ban.error.selfbot.desc"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (member.user.id === message.author.id) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.ban.error.self.desc"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (member.user.id === message.guild.ownerID) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.ban.error.owner.desc"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (!member.bannable) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.ban.error.cantban"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		member.ban({days: 0, reason: banReason}).then((member) => {
			let embed = new Discord.MessageEmbed();
			embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.ban.success.title", [member.user.tag])); // member.user.tag
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.ban.success.reason", [banReason])); // banReason
			embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.ban.success.by", [message.author.tag, message.author.id]), message.author.displayAvatarURL({format: "png", dynamic: true, size: 4096})); // message.author.tag \ message.author.id
			return message.channel.send(embed);
		}).catch((error) => {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(error.name);
			return message.channel.send(embed);
		});
    }
};