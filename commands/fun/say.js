const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "say",
	path: path.basename(__dirname),
    cooldown: 5,
    aliases: ["talk", "speak"],
    usage: "say.usage",
	description: "say.description",
    execute(client, message, args) {
        let message_content = args.slice(0).join(" ").replace(/@everyone/g, "[everyone]").replace(/@here/g, "[here]");
        if (!message_content) {
			var embed = new Discord.MessageEmbed();
            embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_say", "empty_message"));
			embed.setColor([255, 0, 0]);
            return message.inlineReply(embed);
		}

		if (message.guild) {
			if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
				var embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_say", "no_permissions"));
				embed.setColor([255, 0, 0]);
				return message.inlineReply(embed);
			}
		}

        message.channel.send(message_content).then((send_message) => {
            console.log("SAY: " + message.author.tag + " => " + send_message.cleanContent);
			if (message.channel.type === "text") {
				return message.delete().catch(() => {
					var embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_say", "delete_failure"));
					embed.setColor([255, 0, 0]);
					return message.channel.send(embed);
				});
			}
			return;
        }).catch(() => {
			var embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_say", "send_failure"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
        });
    }
};