const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "kick",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "command.kick.usage",
	description: "command.kick.desc",
	flags: constants.cmdFlags.guildOnly,
    async execute(client, message, args) {
		if (!message.member.permissions.has("KICK_MEMBERS")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.kick.no_perms"));
			return message.channel.send(embed);
		}
		
		let find_member = undefined;
		if (args[0]) { find_member = message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
		
		let mentioned_member = message.mentions.members.first();
        let member = mentioned_member || find_member;
		
		let kick_reason = client.utils.getTrans(client, message.author, message.guild, "command.kick.no_reason");
		if (args[1]) { kick_reason = args.slice(1).join(" "); }
		
		if (!member) {
			if (args[0]) {
				member = await client.fetchers.getGuildMember(client, message.guild, args[0]);
			}
			else {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.kick.dont_exists"));
				embed.setColor([255, 0, 0]);
				return message.channel.send(embed);
			}
		}
		
		if (member.user.id === client.user.id) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.kick.myself"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (member.user.id === message.author.id) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.kick.yourself"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (member.user.id === message.guild.ownerID) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.kick.is_owner"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (!member.kickable) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.kick.cant_kick"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		member.kick(kick_reason).then((member) => {
			let embed = new Discord.MessageEmbed();
			embed.setThumbnail(member.user.displayAvatarURL({format: "png", dynamic: true, size: 4096}))
			embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.kick.success.title", [member.user.tag])); // member.user.tag
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.kick.success.reason", [kick_reason])); // kick_reason
			embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.kick.success.by", [message.author.tag]), message.author.displayAvatarURL({format: "png", dynamic: true, size: 4096})); // message.author.tag \ message.author.id
			return message.channel.send(embed);
		}).catch((error) => {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(error.name);
			return message.channel.send(embed);
		});
    }
};