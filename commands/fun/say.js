const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "say",
	path: path.basename(__dirname),
    cooldown: 5,
    aliases: ["talk", "speak"],
    usage: "command.say.usage", //"<mensaje>",
    //flags: constants.cmdFlags.ownerOnly,
	description: "command.say.desc",
    execute(client, message, args) {
        let message_content = args.slice(0).join(" ").replace(/@everyone/g, "").replace(/@here/g, "");
        if (!message_content) {
			var embed = new Discord.MessageEmbed();
            embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.say.msg.failure.empty"));
			embed.setColor([255, 0, 0]);
            return message.channel.send(embed);
		}

		if (message.guild) {
			if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
				var embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.say.permissions"));
				embed.setColor([255, 0, 0]);
				return message.channel.send(embed);
			}
		}

        message.channel.send(message_content).then((send_message) => {
            console.log("SAY: " + message.author.tag + " => " + send_message.cleanContent);
			if (message.channel.type === "text") {
				return message.delete().catch(() => {
					var embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.say.delete.failure"));
					embed.setColor([255, 0, 0]);
					return message.channel.send(embed);
				});
			}
			return;
        }).catch(() => {
			var embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.say.send.failure"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
        });
    }
};