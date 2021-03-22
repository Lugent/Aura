const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "avatar",
	path: path.basename(__dirname),
    aliases: ["icon", "pfp"],
    cooldown: 5,
    usage: "command.avatar.usage",
	description: "command.avatar.desc",
    async execute(client, message, args)
    {
		let findTag = ((args.length) && client.users.cache.find(user => user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)));
        let selected = message.mentions.users.first() || findTag || undefined;
		if (!selected) {
			if (args[0]) { selected = await client.fetchers.getUser(client, args[0]); } else { selected = message.author; }
		}
		if (!selected) {
			var embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.avatar.error.notfound"));
			return message.channel.send(embed);
		}
		
        var embed = new Discord.MessageEmbed();
		embed.setAuthor(client.utils.getTrans(client, message.author, message.guild, "command.avatar.show.footer", [selected.tag, selected.id]), selected.displayAvatarURL({format: "png", dynamic: true, size: 4096}));
        embed.setColor(0x66b3ff);
        embed.setImage(selected.displayAvatarURL({format: "png", dynamic: true, size: 4096}));
        return message.channel.send(embed);
    }
};