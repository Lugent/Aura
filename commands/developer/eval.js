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

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
        let evaluate = args.slice(0).join(" ");
        if (!evaluate.length) {
			let embed = new Discord.MessageEmbed();
            embed.setDescription(":no_entry: " + "Expresión invalido, no se puede ejecutar código inexistente.");
			embed.setColor([255, 0, 0]);
            return message.inlineReply(embed);
		}
        try { eval(evaluate); } catch (error) { throw error; }
    }
}; 