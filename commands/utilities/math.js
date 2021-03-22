const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const maths = require("mathjs");
module.exports = {
    name: "math",
	path: path.basename(__dirname),
    cooldown: 5,
    aliases: ["calc"],
    usage: "command.math.usage",
	description: "command.math.desc",
    execute(client, message, args) {
        const calc = args.slice(0).join(" ");
        if (calc === "") {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.math.error.empty"));
			embed.setColor([255, 255, 0]);
            return message.channel.send(embed);
		}

		try {
			var result = maths.evaluate(calc); //console.log(result);
			var finalresult = result;
			if ((!result) || (result === "")) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.math.error.failure"));
				embed.setColor([255, 0, 0]);
				return message.channel.send(embed);
			}
			
			if (result.value) { finalresult = result.value; }
			if (result.entries) { finalresult = result.entries; }
			if (result._data) { finalresult = result._data; }
			
			let embed = new Discord.MessageEmbed();
			embed.setTitle(finalresult);
			embed.setColor([255, 255, 255]);
			return message.channel.send(embed);
		}
		catch (error) {
			console.error(error);
			
			let embed = new Discord.MessageEmbed();
			//embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.math.error.fatal") + ":");
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.math.error.fatal"));
			embed.addField(error.name, error.message || "undefined");
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
    }
};