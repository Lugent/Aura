const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "eval",
	path: path.basename(__dirname),
    cooldown: 0,
    flags: constants.cmdFlags.ownerOnly,
    usage: "<expresión>",
	description: "Ejecutar código JavaScript arbitrario.",
	async execute(client, message, args) {
        let evaluate = args.slice(0).join(" ");
        if (!evaluate.length) {
			let embed = new Discord.MessageEmbed();
            embed.setDescription(":no_entry: " + "Expresión invalido, no se puede ejecutar código inexistente.");
			embed.setColor([255, 0, 0]);
            return message.channel.send(embed);
		}
        try { eval(evaluate); } catch (error) { throw error; }
    }
};