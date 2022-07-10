const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");

const path = require("path");
module.exports = {
    id: "dm",
	path: path.basename(__dirname),
	type: constants.cmdTypes.normalCommand,

	command_name: "dm",
    command_cooldown: 5,
    command_aliases: ["md", "private"],
    command_usage: "dm.usage",
	command_description: "dm.description",
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async command_execute(client, message, args, prefix) {
		if (!args[0]) {
			var embed = new Discord.MessageEmbed();
			embed.setTitle(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "help.title", [prefix]));
			embed.setDescription(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "help.description"));
			embed.addField(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "help.user"), client.functions.getTranslation(client, message.guild, "commands/fun/dm", "help.user.description"), false);
			embed.addField(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "help.message"), client.functions.getTranslation(client, message.guild, "commands/fun/dm", "help.message.description"), false);
			embed.setColor([0, 255, 255]);
			return message.reply({embeds: [embed]});
		}

		// message
		let msg = args.slice(1).join(" ");
		if (!msg) { return message.reply(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "empty_message"));  }

		// target
		let target_mention = message.mentions.users.first();
		let target_id = client.users.cache.get(args[0]);
		let target_name = client.users.cache.find(user => user.tag.toLowerCase().substring(0, args[0].length) === args[0].toLowerCase().substring(0, args[0].length))
        let target = target_mention || target_id || target_name;
		
		// target check
        if ((!args[0]) || (!target)) { return message.reply(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "not_found")); }
		if (target.bot) { return message.reply(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "is_bot")); }
		if (target.id === process.env.OWNER_ID) { return message.reply(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "my_owner")); }
		if (target.id === message.author.id) { return message.reply(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "yourself")); }

        target.send(msg).then(() => {
			console.log("DM: " + message.author.tag + " => " + target.tag + " >>> " + msg);
            ((message.channel.type === "GUILD_TEXT") && message.delete()) || (message.reply(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "send_success")));
        }).catch(() => {
            message.reply(client.functions.getTranslation(client, message.guild, "commands/fun/dm", "send_failure"));
        });
    }
};