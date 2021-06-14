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

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix)
    {
		let findTag = ((args.length) && client.users.cache.find(user => user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)));
        let selected = message.mentions.users.first() || findTag || undefined;
		if (!selected) {
			if (args[0]) { selected = await client.users.fetch(args[0]); } else { selected = message.author; }
		}
		if (!selected) {
			let embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/avatar", "not_found"));
			return message.channel.send({embed: embed});
		}
		
        let embed = new Discord.MessageEmbed();
		embed.setAuthor(client.functions.getTranslation(client, message.author, message.guild, "commands/information/avatar", "embed.footer", [selected.tag, selected.id]), selected.displayAvatarURL({format: "png", dynamic: true, size: 4096}));
        embed.setColor(0x66b3ff);
        embed.setImage(selected.displayAvatarURL({format: "png", dynamic: true, size: 4096}));
        return message.channel.send({embed: embed});
    }
};