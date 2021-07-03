const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const download = require("file-download");
module.exports = {
    name: "dm",
	path: path.basename(__dirname),
    cooldown: 5,
    aliases: ["md", "private"],
    usage: "dm.usage",
	description: "dm.description",
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix) {
		if (!args[0]) {
			var embed = new Discord.MessageEmbed();
			embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "help.title", [prefix]));
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "help.description"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "help.user"), client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "help.user.description"), false);
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "help.message"), client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "help.message.description"), false);
			embed.setColor([0, 255, 255]);
			return message.reply({embeds: [embed]});
		}
		
        let target = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(user => user.tag.toLowerCase().substring(0, args[0].length) === args[0].toLowerCase().substring(0, args[0].length));
        let msg = args.slice(1).join(" ");
		
		// message
        if ((!args[0]) || (!target)) { return message.reply(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "not_found")); }
		if (target.bot) { return message.reply(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "is_bot")); }
		if (target.id === process.env.OWNER_ID) { return message.reply(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "my_owner")); }
		if (target.id === message.author.id) { return message.reply(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "yourself")); }
		
		// target
        if (!msg) { return message.reply(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "empty_message"));  }

        target.send(msg).then(() => {
			console.log("DM: " + message.author.tag + " => " + target.tag + " > " + msg);
            return ((message.channel.type === "text") && message.delete()) || (message.reply(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "send_success")));
        }).catch(() => {
            return message.reply(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/dm", "send_failure"));
        });
    }
};