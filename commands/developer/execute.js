const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const child_process = require("child_process");
module.exports = {
    name: "execute",
	path: path.basename(__dirname),
    cooldown: 0,
    flags: constants.cmdFlags.ownerOnly,
    usage: "<commando>",
	description: "Ejecutar comandos en el terminal.",
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
		let result;
        let command = args.slice(0).join(" ");
        if (command == "") {
			let embed = new Discord.MessageEmbed();
            embed.setDescription(":no_entry: " + "Comando invalido, no se puede ejecutar.");
			embed.setColor([255, 0, 0]);
            return message.channel.send({embeds: [embed]});
		}
        try {
			let result = await child_process.execSync(command);
			console.log(result.toString());
		}
        catch (error) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(error.message);
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}
    }
}; 