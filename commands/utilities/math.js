const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const maths = require("mathjs");
module.exports = {
    name: "math",
	path: path.basename(__dirname),
    cooldown: 5,
    aliases: ["calc"],
    usage: "math.usage",
	description: "math.description",
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    execute(client, message, args, prefix) {
        const calc = args.slice(0).join(" ");
        if (!calc.length) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "empty"));
			embed.setColor([255, 255, 0]);
            return message.reply({embed: embed});
		}

		try {
			var result = maths.evaluate(calc); //console.log(result);
			var finalresult = result;
			if ((!result) || (!result.length)) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "failure"));
				embed.setColor([255, 0, 0]);
				return message.reply({embed: embed});
			}
			
			if (result.value) { finalresult = result.value; }
			if (result.entries) { finalresult = result.entries; }
			if (result._data) { finalresult = result._data; }
			
			let embed = new Discord.MessageEmbed();
			embed.setTitle(finalresult);
			embed.setColor([255, 255, 255]);
			return message.reply({embed: embed});
		}
		catch (error) {
			throw error;
		}
    }
};